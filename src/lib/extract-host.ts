import { NextRequest } from 'next/server'

export const extractHost = ({ req }: { req: NextRequest }) => `${req.nextUrl.protocol}//${req.headers.get('host')}`
