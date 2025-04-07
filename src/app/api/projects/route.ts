import { NextResponse } from 'next/server';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// API to get all projects
export async function GET(request: Request) {
  try {
    if (!db) {
      return NextResponse.json({ 
        success: false,
        message: 'Firebase is not initialized'
      }, { status: 500 });
    }

    const querySnapshot = await getDocs(collection(db, 'projects'));
    const projects: any[] = [];

    querySnapshot.forEach((doc) => {
      projects.push({
        id: doc.id,
        ...doc.data()
      });
    });

    // Sort by timestamp (newest first)
    projects.sort((a, b) => {
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
      data: projects
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ 
      success: false,
      message: 'Failed to fetch projects'
    }, { status: 500 });
  }
}

// API to create a new project
export async function POST(request: Request) {
  try {
    // Check if user is authenticated (you can implement proper auth middleware)
    // For now, we'll assume the request is authenticated based on your security rules

    if (!db) {
      return NextResponse.json({ 
        success: false,
        message: 'Firebase is not initialized'
      }, { status: 500 });
    }

    const data = await request.json();
    
    // Basic validation
    if (!data.title || !data.description || !data.category || !data.image) {
      return NextResponse.json({ 
        success: false,
        message: 'Missing required fields'
      }, { status: 400 });
    }

    // Add timestamp
    const projectData = {
      ...data,
      timestamp: serverTimestamp()
    };

    // Save to Firestore
    const docRef = await addDoc(collection(db, 'projects'), projectData);

    return NextResponse.json({ 
      success: true,
      message: 'Project created successfully',
      id: docRef.id
    });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ 
      success: false,
      message: 'Failed to create project'
    }, { status: 500 });
  }
} 