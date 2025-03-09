import { CookieSettings } from '@/configuration/cookie-settings'
import { extractHost } from '@/lib/extract-host'
import { NextRequest, NextResponse } from 'next/server'

export const GET = (req: NextRequest) => {
  const idToken = req.cookies.get('id_token')?.value
  const authToken = req.cookies.get('access_token')?.value
  const refreshToken = req.cookies.get('refresh_token')?.value

  const HOST = extractHost({ req })

  if (!idToken || !authToken || !refreshToken) {
    console.error('Error while retrieving access or refresh token')
    return NextResponse.redirect(HOST)
  }

  const isNew = req.nextUrl.searchParams.get('new_user')
  const POST = isNew && isNew === 'true' ? '/newusercallback?refresh=1' : ''

  // Set the token in an HTTP-only cookie
  const response = NextResponse.redirect(HOST + POST)
  response.cookies.set('id_token', idToken, CookieSettings)
  response.cookies.set('access_token', authToken, CookieSettings)
  response.cookies.set('refresh_token', refreshToken, CookieSettings)
  return response
}
