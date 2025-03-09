import { env } from '@/env.mjs'
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { cookies } from 'next/headers'

export const axiosInstance = axios.create({
  baseURL: env.SPRING_SERVER_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// Request interceptor for injecting cookie (for auth) into the request
axiosInstance.interceptors.request.use(
  async <T>(config: InternalAxiosRequestConfig<T>): Promise<InternalAxiosRequestConfig<T>> => {
    // Retrieve and inject cookies for the current request
    const cookieHeader = (await cookies()).toString()
    if (cookieHeader) {
      config.headers.Cookie = cookieHeader
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  },
)
