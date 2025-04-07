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
    
    // Get the image data from request
    const { imageBase64, fileName } = await request.json();
    
    if (!imageBase64) {
      return NextResponse.json({ 
        success: false, 
        message: 'No image provided' 
      }, { status: 400 });
    }

    // Check if Cloudinary is properly configured
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    
    if (!cloudName || !apiKey || !apiSecret) {
      console.error('Missing Cloudinary credentials');
      return NextResponse.json({ 
        success: false, 
        message: 'Server configuration error' 
      }, { status: 500 });
    }
    
    // Generate a unique folder/filename based on the current date
    const date = new Date();
    const timestamp = date.getTime();
    const folder = "portfolio/projects";
    
    // Extract file extension from original filename
    const ext = fileName?.split(".").pop() || "jpg";
    
    // Upload to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(
      `data:image/${ext};base64,${imageBase64}`,
      {
        folder: folder,
        public_id: `${timestamp}_${Math.floor(Math.random() * 1000)}`,
        resource_type: "image",
        overwrite: true,
      }
    );

    // Return the Cloudinary response with URL and other metadata
    return NextResponse.json({
      success: true,
      url: uploadResponse.secure_url,
      public_id: uploadResponse.public_id,
      format: uploadResponse.format,
      width: uploadResponse.width,
      height: uploadResponse.height,
    });
  } catch (error: any) {
    console.error('Error uploading to Cloudinary:', error);
    return NextResponse.json({ 
      success: false, 
      message: error.message || 'Failed to upload image' 
    }, { status: 500 });
  }
} 