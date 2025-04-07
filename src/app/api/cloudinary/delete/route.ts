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

export async function POST(request: Request) {
  try {
    if (!cloudinary) {
      return NextResponse.json({ 
        success: false, 
        message: 'Cloudinary module not available on the server' 
      }, { status: 500 });
    }
    
    // Get the public_id from request
    const { publicId } = await request.json();
    
    if (!publicId) {
      return NextResponse.json({ 
        success: false, 
        message: 'No public_id provided' 
      }, { status: 400 });
    }

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result !== 'ok') {
      return NextResponse.json({ 
        success: false, 
        message: 'Failed to delete image' 
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting from Cloudinary:', error);
    return NextResponse.json({ 
      success: false, 
      message: error.message || 'Failed to delete image' 
    }, { status: 500 });
  }
} 