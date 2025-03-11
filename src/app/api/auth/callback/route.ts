import { axiosFormInstance } from '@/configuration/axios-config'
import { CookieSettings } from '@/configuration/cookie-settings'
import { extractHost } from '@/lib/extract-host'
import { buildExchangeTokenBody } from '@/lib/keycloak-request-constructor'
import { NextRequest, NextResponse } from 'next/server'

interface KeycloakCookieResponse {
  access_token?: string
  id_token?: string
  refresh_token?: string
}

export const GET = async (req: NextRequest) => {
  let idToken = req.cookies.get('id_token')?.value
  let authToken = req.cookies.get('access_token')?.value
  let refreshToken = req.cookies.get('refresh_token')?.value

  const HOST = extractHost({ req })

  try {
    console.log('code', req.nextUrl.searchParams.get('code'))
    console.log('final url', await buildExchangeTokenBody({ code: req.nextUrl.searchParams.get('code') ?? '' }))
    const { data } = await axiosFormInstance.post(
      '/realms/kit-dashboard/protocol/openid-connect/token',
      await buildExchangeTokenBody({ code: req.nextUrl.searchParams.get('code') ?? '' }),
    )
    const { access_token, id_token, refresh_token } = data as KeycloakCookieResponse
    authToken = access_token
    idToken = id_token
    refreshToken = refresh_token
  } catch (_) {
    console.error('Failed to exchange code for tokens.')
    console.error(_)
    return NextResponse.redirect(HOST)
  }
  console.log('HOST', HOST)
  console.log('req', req)
  console.log('req headers', req.headers)
  console.log('req cookies', req.cookies)
  console.log('id', idToken)
  console.log('auth', authToken)

  console.log('refresh', refreshToken)
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
