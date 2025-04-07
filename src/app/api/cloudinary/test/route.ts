import { NextResponse } from 'next/server';
let cloudinary: any;

try {
  // Only import cloudinary on the server side
  const { v2 } = require('cloudinary');
  cloudinary = v2;
  
  // Configure Cloudinary server-side
  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
} catch (error) {
  console.error('Failed to import or configure cloudinary:', error);
}

export async function GET() {
  try {
    if (!cloudinary) {
      return NextResponse.json({ 
        success: false, 
        error: 'Cloudinary module not available on the server' 
      }, { status: 500 });
    }
    
    // Check if Cloudinary is properly configured
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    
    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing Cloudinary configuration' 
      }, { status: 500 });
    }
    
    if (!uploadPreset) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing upload preset' 
      }, { status: 500 });
    }
    
    // Test the Cloudinary API by getting account info
    const accountInfo = await cloudinary.api.ping();
    
    return NextResponse.json({
      success: true,
      message: 'Cloudinary is properly configured',
      cloudName,
      uploadPreset,
      pingResult: accountInfo
    });
  } catch (error: any) {
    console.error('Error testing Cloudinary:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to test Cloudinary connection' 
    }, { status: 500 });
  }
} 