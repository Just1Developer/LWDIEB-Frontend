import jwt from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'

const STATUS_NO = 401,
  STATUS_YES = 200,
  MESSAGE_NO = 'no',
  MESSAGE_YES = 'yes'

const parseJwt = ({ token }: { token: string }) => {
  const decoded = jwt.decode(token) as jwt.JwtPayload | undefined

  if (!decoded) {
    return undefined
  }

  return {
    issuedAt: decoded.iat ? new Date(decoded.iat * 1000).getTime() : undefined, // Convert to Date
    expiresAt: decoded.exp ? new Date(decoded.exp * 1000).getTime() : undefined, // Convert to Date
  }
}

export const GET = (req: NextRequest) => {
  const token = req.cookies.get('access_token')?.value

  if (!token) return NextResponse.json({ status: STATUS_NO, message: MESSAGE_NO })
  const decodedTime = parseJwt({ token })
  if (!decodedTime?.issuedAt || !decodedTime.expiresAt) return NextResponse.json({ status: STATUS_NO, message: MESSAGE_NO })

  // Get the timestamp and validate
  const time = new Date().getTime()
  if (time < decodedTime.issuedAt || time > decodedTime.expiresAt) return NextResponse.json({ status: STATUS_NO, message: MESSAGE_NO })

  // Set the token in an HTTP-only cookie
  return NextResponse.json({ status: STATUS_YES, message: MESSAGE_YES })
}
