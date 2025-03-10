'use server'

import { buildLogoutRequestUrl } from '@/lib/keycloak-request-constructor'
import { NextResponse } from 'next/server'

export const GET = async () => {
  return NextResponse.redirect(await buildLogoutRequestUrl())
}
