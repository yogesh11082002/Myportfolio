import { NextResponse } from 'next/server';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// GET a single contact message by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    if (!db) {
      return NextResponse.json({ 
        success: false,
        message: 'Firebase is not initialized'
      }, { status: 500 });
    }

    const docRef = doc(db, 'contacts', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ 
        success: false,
        message: 'Message not found'
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true,
      data: { id: docSnap.id, ...docSnap.data() }
    });
  } catch (error) {
    console.error('Error fetching message:', error);
    return NextResponse.json({ 
      success: false,
      message: 'Failed to fetch message'
    }, { status: 500 });
  }
}

// UPDATE a contact message (mark as read/unread)
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    if (!db) {
      return NextResponse.json({ 
        success: false,
        message: 'Firebase is not initialized'
      }, { status: 500 });
    }

    const data = await request.json();
    
    // Check if the message exists
    const docRef = doc(db, 'contacts', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ 
        success: false,
        message: 'Message not found'
      }, { status: 404 });
    }

    // Update the message (typically just the read status)
    await updateDoc(docRef, data);

    return NextResponse.json({ 
      success: true,
      message: 'Message updated successfully'
    });
  } catch (error) {
    console.error('Error updating message:', error);
    return NextResponse.json({ 
      success: false,
      message: 'Failed to update message'
    }, { status: 500 });
  }
}

// DELETE a contact message
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    if (!db) {
      return NextResponse.json({ 
        success: false,
        message: 'Firebase is not initialized'
      }, { status: 500 });
    }

    // Check if the message exists
    const docRef = doc(db, 'contacts', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ 
        success: false,
        message: 'Message not found'
      }, { status: 404 });
    }

    // Delete the message
    await deleteDoc(docRef);

    return NextResponse.json({ 
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    return NextResponse.json({ 
      success: false,
      message: 'Failed to delete message'
    }, { status: 500 });
  }
} 