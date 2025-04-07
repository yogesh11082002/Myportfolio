import { NextResponse } from 'next/server';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// GET all contact messages
export async function GET(request: Request) {
  try {
    // This endpoint should only be accessible to the admin
    // You can implement proper authentication middleware
    
    if (!db) {
      return NextResponse.json({ 
        success: false,
        message: 'Firebase is not initialized'
      }, { status: 500 });
    }

    const querySnapshot = await getDocs(collection(db, 'contacts'));
    const messages: any[] = [];

    querySnapshot.forEach((doc) => {
      messages.push({
        id: doc.id,
        ...doc.data()
      });
    });

    // Sort by timestamp (newest first)
    messages.sort((a, b) => {
      if (!a.timestamp) return 1;
      if (!b.timestamp) return -1;
      
      try {
        return b.timestamp.toDate() - a.timestamp.toDate();
      } catch (e) {
        return 0;
      }
    });

    return NextResponse.json({ 
      success: true,
      data: messages
    });
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    return NextResponse.json({ 
      success: false,
      message: 'Failed to fetch contact messages'
    }, { status: 500 });
  }
}

// POST a new contact message
export async function POST(request: Request) {
  try {
    if (!db) {
      return NextResponse.json({ 
        success: false,
        message: 'Firebase is not initialized'
      }, { status: 500 });
    }

    const data = await request.json();
    
    // Basic validation
    if (!data.name || !data.email || !data.message) {
      return NextResponse.json({ 
        success: false,
        message: 'Missing required fields'
      }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json({ 
        success: false,
        message: 'Invalid email format'
      }, { status: 400 });
    }

    // Add timestamp and read status
    const contactData = {
      ...data,
      timestamp: serverTimestamp(),
      read: false
    };

    // Save to Firestore
    const docRef = await addDoc(collection(db, 'contacts'), contactData);

    return NextResponse.json({ 
      success: true,
      message: 'Message sent successfully',
      id: docRef.id
    });
  } catch (error) {
    console.error('Error sending contact message:', error);
    return NextResponse.json({ 
      success: false,
      message: 'Failed to send message'
    }, { status: 500 });
  }
} 