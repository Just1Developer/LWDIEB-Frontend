'use server'

import { buildLoginRequestUrl } from '@/lib/keycloak-request-constructor'
import { NextResponse } from 'next/server'

export const GET = async () => {
  console.log('Hello!')
  return NextResponse.redirect(await buildLoginRequestUrl({ hint: 'google' }))
}
