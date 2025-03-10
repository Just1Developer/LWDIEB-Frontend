'use server'

import { env } from '@/env.mjs'
import { getToken } from '@/lib/cookie-reader'

const authPath = '/realms/kit-dashboard/protocol/openid-connect/auth'
const loginRedirectUri = '/api/auth/callback'
const logoutPath = '/realms/kit-dashboard/protocol/openid-connect/logout'
const logoutRedirectUri = '/api/auth/post-logout'

export const buildLoginRequestUrl = async ({ hint }: { hint: string }) => {
  return `${env.LW_SERVER_URL}${authPath}?client_id=${encodeURIComponent(env.KC_SPRING_CLIENT)}&redirect_uri=${encodeURIComponent(`${env.NEXT_URL}${loginRedirectUri}`)}&response_type=code&scope=openid&state=${new Date().getTime()}&kc_idp_hint=${hint}&prompt=login`
}

export const buildLogoutRequestUrl = async () => {
  const id_token = (await getToken({ token: 'id_token' }))?.sub
  const logout = `${env.NEXT_URL}${logoutRedirectUri}`
  if (!id_token) return logout
  return `${env.LW_SERVER_URL}${logoutPath}?id_token_hint=${encodeURIComponent(id_token)}&post_logout_redirect_uri=${encodeURIComponent(logout)}`
}

export const buildRefreshBody = async () => {
  const refresh_token = (await getToken({ token: 'refresh_token' }))?.sub
  return `grant_type=refresh_token&client_id=${encodeURIComponent(env.KC_SPRING_CLIENT)}&client_secret=${encodeURIComponent(env.KC_SPRING_SECRET)}&refresh_token=${encodeURIComponent(refresh_token ?? 'undefined')}`
}
