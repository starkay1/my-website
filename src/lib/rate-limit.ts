import { NextRequest } from 'next/server'

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

interface RateLimitOptions {
  interval: number // in milliseconds
  uniqueTokenPerInterval: number // max requests per interval
}

export function rateLimit(options: RateLimitOptions) {
  return {
    check: async (request: NextRequest, limit: number, token: string) => {
      const now = Date.now()
      const tokenData = rateLimitMap.get(token)
      
      if (!tokenData || now > tokenData.resetTime) {
        // Reset or initialize
        rateLimitMap.set(token, {
          count: 1,
          resetTime: now + options.interval
        })
        return { success: true }
      }
      
      if (tokenData.count >= limit) {
        return { 
          success: false, 
          error: 'Rate limit exceeded',
          resetTime: tokenData.resetTime
        }
      }
      
      // Increment count
      tokenData.count += 1
      rateLimitMap.set(token, tokenData)
      
      return { success: true }
    }
  }
}

// Default rate limiter instance
export const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500 // Limit each IP to 500 requests per minute
})

// Helper function to get client IP
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP
  }
  
  return request.ip || 'unknown'
}