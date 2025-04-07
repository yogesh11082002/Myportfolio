import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory cache for rate limiting (would use Redis in production)
const ipRequests: Record<string, { count: number; timestamp: number }> = {};

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const url = request.nextUrl.pathname;
  
  // Add extra security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // Apply rate limiting for admin and auth API routes
  if (url.startsWith('/admin') || url.startsWith('/api/auth')) {
    const ip = request.ip || '127.0.0.1';
    const now = Date.now();
    
    // Clean up old entries (older than 1 minute)
    for (const [storedIp, data] of Object.entries(ipRequests)) {
      if (now - data.timestamp > 60 * 1000) {
        delete ipRequests[storedIp];
      }
    }
    
    // Initialize or update request count for this IP
    if (!ipRequests[ip]) {
      ipRequests[ip] = { count: 0, timestamp: now };
    }
    
    ipRequests[ip].count += 1;
    ipRequests[ip].timestamp = now;
    
    // If more than 10 requests in a minute, rate limit
    if (ipRequests[ip].count > 10) {
      return new NextResponse(
        JSON.stringify({ error: 'Too many requests, please try again later' }),
        { 
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': '60'
          }
        }
      );
    }
  }
  
  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/api/auth/:path*'],
} 