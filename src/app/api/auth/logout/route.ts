'use server'

import { NextResponse } from 'next/server'
import { buildLogoutRequestUrl } from '@/lib/keycloak-request-constructor'

export const GET = async () => {
  return NextResponse.redirect(await buildLogoutRequestUrl())
}
