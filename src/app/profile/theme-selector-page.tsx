import { ResponsiveDialog } from '@/components/responsive-dialog'
import { ThemeToggle } from '@/components/theme-toggle'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DEFAULT_DARK_THEME, DEFAULT_LIGHT_THEME, fallbackUser, toBackendUser } from '@/configuration/userdata-config'
import { postUser } from '@/features/actions/user-post'
import { LocationPickerProps } from '@/features/edit-dashboard/editgrid'
import { useUserData } from '@/features/shared/user-provider'
import { rgba } from '@/lib/theme-helpers'
import { Theme } from '@/lib/types'
import { Dispatch, isValidElement, ReactNode, SetStateAction, useEffect, useRef, useState } from 'react'
import { HexColorPicker } from 'react-colorful'

export const ThemeSelectorPage = () => {
  const { user = fallbackUser, userdata, selectedTheme } = useUserData()
  const { darkTheme, lightTheme } = userdata
  const [currentLightTheme, setCurrentLightTheme] = useState<Theme>(lightTheme)
  const [currentBufferedLightTheme, setCurrentBufferedLightTheme] = useState<Theme>(currentLightTheme)
  const [currentDarkTheme, setCurrentDarkTheme] = useState<Theme>(darkTheme)
  const [currentBufferedDarkTheme, setCurrentBufferedDarkTheme] = useState<Theme>(currentDarkTheme)
  const [isSaving, setIsSaving] = useState(false)
  const [dialog, setDialog] = useState<ReactNode | LocationPickerProps>(undefined)

  useEffect(() => {
    const timer = setTimeout(() => setCurrentBufferedLightTheme(currentLightTheme), 5)
    return () => clearTimeout(timer)
  }, [currentLightTheme])

  useEffect(() => {
    const timer = setTimeout(() => setCurrentBufferedDarkTheme(currentDarkTheme), 5)
    return () => clearTimeout(timer)
  }, [currentDarkTheme])

  const saveUserData = () => {
    setIsSaving(true)
    const newUserData = {
      ...userdata,
      darkTheme: currentBufferedDarkTheme,
      lightTheme: currentBufferedLightTheme,
    }
    const newUser = toBackendUser({ userdata: newUserData })
    postUser({ user: newUser }).then(() => {
      window.location.reload()
      setIsSaving(false)
    })
  }

  return (
    <>
      {isValidElement(dialog) && <div className="pointer-events-none absolute inset-0">{dialog}</div>}
      <div
        className="h-full w-full space-y-12 overflow-y-auto overflow-x-hidden p-20"
        style={((theme: Theme) => ({
          color: theme.foregroundText,
          backgroundColor: theme.backgroundBoard,
          accentColor: theme.accent,
        }))(selectedTheme === 'light' ? currentBufferedLightTheme : currentBufferedDarkTheme)}
      >
        <div className="flex w-full flex-col text-[170%] font-semibold">
          Hello, {user.name}!<div className="text-[95%]">You can customize your light and dark themes here!</div>
          <div className="pl-4 pt-7 text-[85%]">
            Toggle Theme: <ThemeToggle />
          </div>
        </div>
        <ThemePicker
          defaultTheme={lightTheme}
          resetTheme={DEFAULT_LIGHT_THEME}
          currentTheme={currentBufferedLightTheme}
          setCurrentTheme={setCurrentLightTheme}
          themeName={'Light Theme'}
          saveUserData={saveUserData}
          isSaving={isSaving}
          setDialog={setDialog}
        />
        <ThemePicker
          defaultTheme={darkTheme}
          resetTheme={DEFAULT_DARK_THEME}
          currentTheme={currentBufferedDarkTheme}
          setCurrentTheme={setCurrentDarkTheme}
          themeName={'Dark Theme'}
          saveUserData={saveUserData}
          isSaving={isSaving}
          setDialog={setDialog}
        />
      </div>
    </>
  )
}

const ThemePicker = ({
  defaultTheme,
  resetTheme,
  currentTheme: theme,
  setCurrentTheme,
  themeName,
  saveUserData,
  isSaving,
  setDialog,
}: {
  defaultTheme: Theme
  resetTheme: Theme
  currentTheme: Theme
  setCurrentTheme: Dispatch<SetStateAction<Theme>>
  themeName: string
  saveUserData: () => void
  isSaving: boolean
  setDialog: Dispatch<SetStateAction<ReactNode | LocationPickerProps>>
}) => {
  return (
    <div>
      <ThemeBlockStyleContainer theme={theme}>
        <div className="flex flex-row items-center gap-2">
          <div className="text-[120%] font-semibold">
            <Badge>{themeName}</Badge>
          </div>
        </div>
        <div className="m-5 flex flex-row gap-3 overflow-x-auto overflow-y-hidden rounded-md border border-zinc-500/20 p-2">
          <ColorPicker
            name={'Board Background'}
            color={theme.backgroundBoard}
            onChange={(color) => setCurrentTheme({ ...theme, backgroundBoard: color })}
            theme={theme}
            setDialog={setDialog}
          />
          <ColorPicker
            name={'Widget Background'}
            color={theme.backgroundWidget}
            onChange={(color) => setCurrentTheme({ ...theme, backgroundWidget: color })}
            theme={theme}
            setDialog={setDialog}
          />
          <ColorPicker
            name={'Button Background'}
            color={theme.backgroundButton}
            onChange={(color) => setCurrentTheme({ ...theme, backgroundButton: color })}
            theme={theme}
            setDialog={setDialog}
          />
          <ColorPicker
            name={'Button Foreground'}
            color={theme.foregroundButton}
            onChange={(color) => setCurrentTheme({ ...theme, foregroundButton: color })}
            theme={theme}
            setDialog={setDialog}
          />
          <ColorPicker
            name={'Text Color'}
            color={theme.foregroundText}
            onChange={(color) => setCurrentTheme({ ...theme, foregroundText: color })}
            theme={theme}
            setDialog={setDialog}
          />
          <ColorPicker
            name={'Foreground Other'}
            color={theme.foregroundOther}
            onChange={(color) => setCurrentTheme({ ...theme, foregroundOther: color })}
            theme={theme}
            setDialog={setDialog}
          />
          <ColorPicker
            name={'Accent'}
            color={theme.accent}
            onChange={(color) => setCurrentTheme({ ...theme, accent: color })}
            theme={theme}
            setDialog={setDialog}
          />
          <ColorPicker
            name={'Accent Foreground'}
            color={theme.accentForeground}
            onChange={(color) => setCurrentTheme({ ...theme, accentForeground: color })}
            theme={theme}
            setDialog={setDialog}
          />
        </div>
        <div className="flex flex-row gap-3">
          <Button onClick={saveUserData} disabled={isSaving} theme={theme} className={isSaving ? 'cursor-wait' : 'cursor-pointer'}>
            Save Theme
          </Button>
          <Button onClick={() => setCurrentTheme(defaultTheme)} disabled={isSaving} theme={theme}>
            Reset
          </Button>
          <Button onClick={() => setCurrentTheme(resetTheme)} disabled={isSaving} theme={theme}>
            Reset to Default {themeName}
          </Button>
        </div>
      </ThemeBlockStyleContainer>
    </div>
  )
}

const ColorPicker = ({
  name,
  color,
  onChange,
  theme,
  setDialog,
}: {
  name: string
  color: string
  onChange: (color: string) => void
  theme: Theme
  setDialog: Dispatch<SetStateAction<ReactNode | LocationPickerProps>>
}) => {
  return (
    <div className="min-w-68" style={{ backgroundColor: theme.backgroundWidget }}>
      <ThemeBlockStyleContainer theme={theme}>
        <div className="flex h-full w-full flex-col gap-2" style={{ backgroundColor: theme.backgroundWidget }}>
          <div className="flex flex-col gap-0 space-y-0 text-left">
            <div className="text-[120%] font-semibold">{name}</div>
            <div
              className="w-16 cursor-pointer text-[100%] text-zinc-500"
              onClick={(e) => {
                e.preventDefault()
                setDialog(<CustomHexDialog color={color} onChange={onChange} setDialog={setDialog} />)
              }}
            >
              {color}
            </div>
          </div>
          <div className="justify-end">
            <HexColorPicker color={color} onChange={onChange} />
          </div>
        </div>
      </ThemeBlockStyleContainer>
    </div>
  )
}

const CustomHexDialog = ({
  color,
  onChange,
  setDialog,
}: {
  color: string
  onChange: (color: string) => void
  setDialog: Dispatch<SetStateAction<ReactNode | LocationPickerProps>>
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [valid, setValid] = useState<boolean>(true)
  return (
    <ResponsiveDialog
      type={'small'}
      callbackAction={() => onChange(inputRef.current?.value ?? color)}
      title="Choose Hex Color"
      setDialogAction={setDialog}
      confirmEnabled={valid}
    >
      <input
        ref={inputRef}
        className="min-h-8 rounded-sm pl-1"
        defaultValue={color}
        onChange={() => {
          if (inputRef.current?.value.length == 0) inputRef.current.value = '#'
          else if (inputRef.current && inputRef.current.value.length > 1)
            inputRef.current.value = inputRef.current.value.replace(/^#*/, '#')
          setValid(!!/#[a-f\d]{6}/i.exec(inputRef.current?.value ?? color))
        }}
      />
    </ResponsiveDialog>
  )
}

const ThemeBlockStyleContainer = ({ children, theme }: { children: ReactNode; theme: Theme }) => (
  <div
    className="flex h-full w-full overflow-hidden rounded-md border-2 p-1 shadow-md shadow-accent/20"
    style={{ color: theme.foregroundText, backgroundColor: theme.backgroundWidget, borderColor: rgba(theme.accent, 0.3) }}
  >
    <div className="h-full w-full overflow-hidden rounded-lg p-3 shadow-2xl" style={{ backgroundColor: theme.backgroundWidget }}>
      {children}
    </div>
  </div>
)
