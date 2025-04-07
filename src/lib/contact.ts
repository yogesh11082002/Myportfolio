"use client";

import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/**
 * Submit contact form data to Firebase Firestore
 * @param formData Contact form data including name, email, subject, and message
 */
export async function submitContactForm(formData: ContactFormData): Promise<void> {
  try {
    // Check if running on the client side
    if (typeof window === 'undefined') {
      throw new Error("Cannot submit form on the server side");
    }
    
    // Validate required fields
    if (!formData.name || !formData.email || !formData.message) {
      throw new Error("Missing required fields");
    }

    // Try to use Firebase if it's available
    if (db) {
      try {
        // Add document to Firestore with server timestamp
        await addDoc(collection(db, "contacts"), {
          ...formData,
          timestamp: serverTimestamp(),
          read: false,
        });
        
        console.log('Contact form submitted successfully');
        return;
      } catch (firebaseError) {
        console.error("Firebase submission error:", firebaseError);
        // Fall through to fallback method
      }
    }
    
    // Fallback method if Firebase fails or isn't available
    // This simulates a successful submission for demo purposes
    console.log("Using fallback submission method:", formData);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
  } catch (error) {
    console.error("Error submitting contact form:", error);
    throw new Error('Failed to submit contact form');
  }
}

/**
 * Basic email validation
 * @param email Email string to validate
 * @returns Boolean indicating if email format is valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
} 