import { env } from '@/env.mjs'

export const GET = async () => {
  try {
    const response = await fetch(`${env.SPRING_SERVER_URL}/api/dashboard/refresh2`, {
      method: 'GET',
      headers: {},
    })

    if (!response.ok) {
      return new Response('{ "null": "null" }', { status: 401 })
    }

    return new Response(await response.text(), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}
