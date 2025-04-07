# Firebase Setup Instructions

This document outlines how to set up Firebase for the contact form functionality in this portfolio website.

## Prerequisites

1. Create a Firebase account at [firebase.google.com](https://firebase.google.com/) if you don't have one.
2. Install Firebase CLI: `npm install -g firebase-tools`

## Setup Steps

### 1. Create a new Firebase project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Follow the on-screen instructions to create your project
4. Enable Google Analytics (optional)

### 2. Register your app with Firebase

1. In your Firebase project console, click "Web" (</>) to add a web app
2. Provide a nickname for your app (e.g., "Portfolio Website")
3. Click "Register app"
4. Copy the Firebase configuration object (we'll need this later)

### 3. Set up Firestore

1. In your Firebase project console, navigate to "Firestore Database"
2. Click "Create database"
3. Start in production mode (or test mode if you're still developing)
4. Choose a location closest to your target audience
5. Click "Enable"

### 4. Configure environment variables

1. Create a `.env.local` file in the root of your project by copying from `.env.example`
2. Add your Firebase configuration values from the configuration object you copied earlier:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

3. **Important**: After creating the `.env.local` file, restart your development server for the changes to take effect:
   ```
   npm run dev
   ```

### 5. Deploy Firestore security rules

1. Log in to Firebase: `firebase login`
2. Initialize Firebase in your project: `firebase init`
   - Select Firestore
   - Choose your project
   - Accept the default file names for Firestore rules
3. Deploy rules: `firebase deploy --only firestore`

## Firestore Data Structure

The contact form submissions are stored in the `contact` collection with the following fields:

- `name`: String - The name of the person submitting the form
- `email`: String - The email address
- `subject`: String (optional) - The subject of the message
- `message`: String - The message content
- `createdAt`: Timestamp - When the message was submitted
- `status`: String - Status of the message (default: "new")
- `readAt`: Timestamp (nullable) - When the message was read

## Security Rules

The Firestore security rules (in `firestore.rules`) are configured to:

1. Allow public write access to the contact collection (for submissions)
2. Prevent read access to all collections (for security)

## Testing

To test the contact form submission:

1. Start your development server: `npm run dev`
2. Navigate to the contact page
3. Fill out and submit the form
4. Check your Firestore database in the Firebase console to verify the submission

## Troubleshooting

### Firebase API Key Error

If you see an error like `Firebase: Error (auth/invalid-api-key)`, it means your Firebase configuration is not properly set up. Follow these steps:

1. Make sure your `.env.local` file exists and contains all the necessary Firebase configuration values.
2. Ensure you've replaced the placeholder values with your actual Firebase project values.
3. Restart your development server after making changes to the `.env.local` file.
4. Check that you've correctly copied the API key from your Firebase project settings.

### Firebase Not Initialized Error

If you see an error mentioning that Firebase is not initialized, try the following:

1. Ensure that you're running the application in a browser (client-side), as Firebase authentication requires the browser environment.
2. Check that your `.env.local` file has the correct configuration values.
3. Verify that your Firebase project is correctly set up and the API key is valid.

### Contact Form Not Submitting

If the contact form doesn't submit or shows errors:

1. Open your browser console to check for specific error messages.
2. Verify that your Firebase Firestore database is set up and that the security rules allow write access to the contact collection.
3. Ensure your internet connection is working properly.
4. If using a deployed version, make sure the environment variables are correctly set in your deployment platform (Vercel, Netlify, etc.).
