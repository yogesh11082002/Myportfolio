import { NextResponse } from 'next/server';
import { doc, getDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// GET a single project by ID
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

    const docRef = doc(db, 'projects', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ 
        success: false,
        message: 'Project not found'
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true,
      data: { id: docSnap.id, ...docSnap.data() }
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json({ 
      success: false,
      message: 'Failed to fetch project'
    }, { status: 500 });
  }
}

// UPDATE a project by ID
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
    
    // Basic validation
    if (!data.title || !data.description || !data.category) {
      return NextResponse.json({ 
        success: false,
        message: 'Missing required fields'
      }, { status: 400 });
    }

    // Check if the project exists
    const docRef = doc(db, 'projects', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ 
        success: false,
        message: 'Project not found'
      }, { status: 404 });
    }

    // Update the project with a new timestamp
    const projectData = {
      ...data,
      timestamp: serverTimestamp()
    };

    await updateDoc(docRef, projectData);

    return NextResponse.json({ 
      success: true,
      message: 'Project updated successfully'
    });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json({ 
      success: false,
      message: 'Failed to update project'
    }, { status: 500 });
  }
}

// DELETE a project by ID
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

    // Check if the project exists
    const docRef = doc(db, 'projects', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ 
        success: false,
        message: 'Project not found'
      }, { status: 404 });
    }

    // Delete the project
    await deleteDoc(docRef);

    return NextResponse.json({ 
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ 
      success: false,
      message: 'Failed to delete project'
    }, { status: 500 });
  }
} 