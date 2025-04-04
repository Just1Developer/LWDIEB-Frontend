'use server'

import { FALLBACK_USER } from '@/configuration/userdata-config'
import { User } from '@/lib/types'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

export const getUserFromAccessJWT = async (): Promise<User> => {
  const accessToken = decodeJWT({ token: (await cookies()).get('access_token')?.value })
  if (!accessToken) return FALLBACK_USER

  const { id: fallbackId, name: fallbackName, admin: fallbackAdmin, email: fallbackEmail, language: fallbackLang } = FALLBACK_USER
  // It's fine
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const isAdmin = (accessToken?.realm_access?.roles?.includes('admin') as boolean) ?? fallbackAdmin

  return {
    id: accessToken.sub ?? fallbackId,
    name: accessToken.name ?? fallbackName,
    admin: isAdmin,
    email: accessToken.email ?? fallbackEmail,
    language: fallbackLang,
  }
}

export const areTokensExpired = async () => {
  const exp = decodeJWT({ token: await getCookieNamed({ token: 'refresh_token' }) })?.exp
  if (!exp) return true
  return Date.now() > new Date(exp * 1000).getTime()
}

export const getCookieNamed = async ({ token }: { token: string }) => (await cookies()).get(token)?.value

const decodeJWT = ({ token }: { token: string | undefined }) => {
  if (!token) return undefined
  return jwt.decode(token) as jwt.JwtPayload | undefined
}
