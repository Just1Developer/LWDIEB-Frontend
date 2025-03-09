'use server'

import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { User } from '@/lib/types'
import { FALLBACK_USER } from '@/configuration/userdata-config'

export const getUserFromAccessJWT = async (): Promise<User> => {
  const accessToken = decodeJWT({ token: (await cookies()).get('access_token')?.value })
  if (!accessToken) return FALLBACK_USER
  const { id: fallbackId, name: fallbackName, admin: fallbackAdmin, email: fallbackEmail, language: fallbackLang } = FALLBACK_USER
  const isAdmin = accessToken.realm_access?.roles?.includes('admin') ?? fallbackAdmin
  console.log('access_token: (cookie-reader.ts)', accessToken)
  return {
    id: accessToken.sub ?? fallbackId,
    name: accessToken.name ?? fallbackName,
    admin: isAdmin,
    email: accessToken.email ?? fallbackEmail,
    language: fallbackLang,
  }
}

const decodeJWT = ({ token }: { token: string | undefined }) => {
  if (!token) return undefined
  return jwt.decode(token) as jwt.JwtPayload | undefined
}
