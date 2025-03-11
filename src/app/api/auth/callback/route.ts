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
  let idToken: string | undefined
  let authToken: string | undefined
  let refreshToken: string | undefined

  const HOST = extractHost({ req })

  try {
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
    return NextResponse.redirect(HOST)
  }

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
