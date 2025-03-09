// Times (in seconds)
const cookieTime = 60 * 65 // 65 Minutes
export const cookieRefreshTime = 60 * 30 // 30 Minutes

export interface CookieOptions {
  httpOnly: boolean
  secure: boolean
  sameSite: 'lax' | 'strict' | 'none'
  path: string
  maxAge: number
}

export const CookieSettings = {
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
  path: '/',
  maxAge: cookieTime,
} as CookieOptions
