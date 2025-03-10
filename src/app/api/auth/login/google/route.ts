'use server'

import { NextResponse } from 'next/server'
import { buildLoginRequestUrl } from '@/lib/keycloak-request-constructor'

export const GET = async () => {
  return NextResponse.redirect(await buildLoginRequestUrl({ hint: 'google' }))
}
