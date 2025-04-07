import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    // Check against environment variables
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    // Basic validation
    if (!email || !password) {
      return NextResponse.json({ 
        success: false,
        message: 'Email and password are required'
      }, { status: 400 });
    }
    
    // Check if admin email is configured
    if (!adminEmail || adminEmail === "yogeshthakur938920@gmail.com") {
      console.warn("Using default admin email. In production, use environment variables.");
    }
    
    // Check if admin password is configured
    if (!adminPassword || adminPassword === "Mybase@56") {
      console.warn("Using default admin password. In production, use environment variables.");
    }
    
    // Admin authentication logic
    if (email === (adminEmail || "yogeshthakur938920@gmail.com") && 
        password === (adminPassword || "Mybase@56")) {
      return NextResponse.json({ 
        success: true,
        message: 'Authentication successful',
        user: {
          email: email,
          role: 'admin'
        }
      });
    } else {
      return NextResponse.json({ 
        success: false,
        message: 'Invalid credentials'
      }, { status: 401 });
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json({ 
      success: false,
      message: 'Authentication failed'
    }, { status: 500 });
  }
} 