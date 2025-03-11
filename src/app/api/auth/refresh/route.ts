import { axiosInstance } from '@/configuration/axios-config'
import { CookieSettings } from '@/configuration/cookie-settings'
import { sendRefreshRequest } from '@/features/actions/user-post'
import { areTokensExpired } from '@/lib/cookie-reader'
import { NextResponse } from 'next/server'

export const GET = async () => {
  try {
    const expired = await areTokensExpired()

    const response = expired ? undefined : await sendRefreshRequest()
    if (!expired && (!response || response.status >= 500)) {
      return NextResponse.json({ status: 500 })
    }

    if (expired || response?.status !== 200) {
      // Send a logout request to the backend and thus keycloak in the background
      void axiosInstance.get('/api/auth/logout')
      const res = NextResponse.json({ status: 302 })
      res.cookies.delete('JSESSIONID')
      res.cookies.delete('id_token')
      res.cookies.delete('access_token')
      res.cookies.delete('refresh_token')
      return res
    }

    const res = NextResponse.json({ status: 200 })

    // Remove existing cookies (this works I confirmed with logs, these are new cookies)
    res.cookies.delete('id_token')
    res.cookies.delete('access_token')
    res.cookies.delete('refresh_token')

    // Replace Cookies
    res.cookies.set('id_token', response.data.id_token, CookieSettings)
    res.cookies.set('access_token', response.data.access_token, CookieSettings)
    res.cookies.set('refresh_token', response.data.refresh_token, CookieSettings)

    return res
  } catch (error) {
    let msg
    if (error instanceof Error) {
      msg = `Axios Fault: Error while refreshing tokens: ${error.message}`
    } else {
      msg = 'An unknown error occurred while refreshing tokens (unknown)'
    }
    return NextResponse.json({ status: 500, message: msg })
  }
}
