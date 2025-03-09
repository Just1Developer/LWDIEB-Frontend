import { BackendUser, DEFAULT_USER_DATA, toUser } from '@/configuration/userdata-config'
import { updateSelectedTheme } from '@/features/actions/user-post'
import { AvailableThemes, Theme, User, UserData } from '@/lib/types'
import { useQuery } from '@tanstack/react-query'
import { useTheme } from 'next-themes'
import { createContext, ReactNode, useContext, useState } from 'react'
import { DEFAULT_USER_UUID } from '@/configuration/default-dashboard-config'

interface UserContextProps {
  loaded: boolean
  userId: string
  user: User | undefined
  userdata: UserData
  theme: Theme
  selectedTheme: AvailableThemes
  setTheme: (theme: AvailableThemes) => void
  setThemeLocally: (theme: AvailableThemes) => void
}

const UserContext = createContext<UserContextProps | undefined>(undefined)

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { theme: nextTheme, setTheme: setNextTheme } = useTheme()
  const [selectedTheme, setSelectedTheme] = useState<AvailableThemes>(nextTheme === 'dark' ? 'dark' : 'light')

  const fetchUser = async (): Promise<UserData | undefined> => {
    try {
      const res = await fetch('/api/user', { credentials: 'include' })

      if (!res.ok) {
        return DEFAULT_USER_DATA
      }

      const json = await res.json()
      const user = toUser({ dataUser: json as BackendUser })
      setNextTheme(user.selectedTheme)
      setSelectedTheme(user.selectedTheme)
      return user
    } catch (error) {
      return DEFAULT_USER_DATA
    }
  }

  const { data: userdata } = useQuery<UserData | undefined>({
    queryKey: ['user'],
    queryFn: fetchUser,
    retry: false,
  })

  const setTheme = (theme: AvailableThemes) => {
    void updateSelectedTheme({ theme }).then(() => setThemeLocally(theme))
  }

  const setThemeLocally = (theme: AvailableThemes) => {
    setNextTheme(theme)
    setSelectedTheme(theme)
  }

  const data = userdata ?? DEFAULT_USER_DATA

  return (
    <UserContext.Provider
      value={{
        loaded: !!userdata,
        userId: data.user?.id ?? DEFAULT_USER_UUID,
        user: data.user,
        userdata: data,
        selectedTheme,
        theme: selectedTheme === 'dark' ? data.darkTheme : data.lightTheme,
        setTheme,
        setThemeLocally,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUserData = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUserData must be used within the context')
  }
  return context
}
