import { extractHost } from '@/lib/extract-host'
import { NextRequest, NextResponse } from 'next/server'

export const GET = (req: NextRequest) => {
  const redirectUrl = extractHost({ req })
  const response = NextResponse.redirect(redirectUrl)
  // Remove existing cookies
  const cookies = ['JSESSIONID', 'id_token', 'access_token', 'refresh_token']
  for (const del of cookies) {
    response.cookies.set(del, '') // erase / override
  }
  for (const del of cookies) {
    response.cookies.delete(del) // delete
  }
  return response
}
