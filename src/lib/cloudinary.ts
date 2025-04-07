// This file contains client-side utilities for working with Cloudinary through our API

// Convert file to base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result as string;
      // Extract the base64 data without the prefix
      const base64Data = base64.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = (error) => reject(error);
  });
};

// Function to upload image to Cloudinary via our API
export const uploadToCloudinary = async (file: File): Promise<string> => {
  try {
    // Convert file to base64
    const base64data = await fileToBase64(file);
    
    // Call our API endpoint
    const uploadResponse = await fetch('/api/cloudinary/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageBase64: base64data,
        fileName: file.name
      }),
    });

    if (!uploadResponse.ok) {
      throw new Error('Failed to upload image to Cloudinary');
    }

    const data = await uploadResponse.json();
    return data.url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};

// Function to delete image from Cloudinary
export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    await fetch('/api/cloudinary/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ publicId }),
    });
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw error;
  }
};

// Helper to extract public_id from Cloudinary URL
export const getPublicIdFromUrl = (url: string): string => {
  // Regular expression to match the public ID in Cloudinary URL
  // e.g., from https://res.cloudinary.com/demo/image/upload/v1234567890/portfolio/projects/image.jpg
  // it extracts portfolio/projects/image
  
  try {
    const regex = /\/v\d+\/(.+?)\.\w+$/;
    const match = url.match(regex);
    return match ? match[1] : '';
  } catch (error) {
    console.error('Error extracting public ID:', error);
    return '';
  }
};

// Add this function to directly upload to Cloudinary without requiring a preset
export async function uploadDirectToCloudinary(file: File): Promise<{
  url: string;
  public_id: string;
  width: number;
  height: number;
}> {
  // Convert the file to base64
  const base64Data = await fileToBase64(file);
  
  try {
    // Upload to our API endpoint
    const response = await fetch('/api/cloudinary/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        imageBase64: base64Data, 
        fileName: file.name 
      }),
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Unknown error during upload');
    }
    
    return {
      url: result.url,
      public_id: result.public_id,
      width: result.width,
      height: result.height
    };
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
} 