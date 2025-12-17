# Unit 3 Quiz V005 - Voting Website Miles

A React + Vite voting website application hosted on Firebase.

## Firebase Project Setup

**Project ID**: `unit3quiz-v005-voting`  
**Note**: Firebase project IDs are limited to 30 characters, so the full name "unit3quiz-v005-votingwebsitemiles" was shortened to fit Firebase's requirements.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase CLI (`npm install -g firebase-tools`)
- You are already logged into Firebase CLI

## Firebase Project Status

✅ Firebase project created: `unit3quiz-v005-voting`  
✅ Firebase web app created  
✅ Firebase configuration files created  
✅ Environment variables configured  
✅ Firebase SDK installed  

## Enable Firestore Database

**Important**: Firestore needs to be enabled through the Firebase Console:

1. Go to [Firebase Console](https://console.firebase.google.com/project/unit3quiz-v005-voting/overview)
2. Click on **"Firestore Database"** in the left sidebar
3. Click **"Create database"**
4. Choose your preferred location:
   - Recommended: **nam5** (North America multi-region)
   - Or select the region closest to your users
5. Choose security rules:
   - **Start in test mode** (for development) - allows read/write access for 30 days
   - Or **Start in production mode** (for production) - requires authentication
6. Click **"Enable"**

After enabling Firestore, you can deploy the security rules:

```bash
firebase deploy --only firestore:rules
```

## Environment Variables

The `.env` file has been created with your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=AIzaSyAn6iS0kWf2U-LMYIApq6_fTMFdFWDehcQ
VITE_FIREBASE_AUTH_DOMAIN=unit3quiz-v005-voting.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=unit3quiz-v005-voting
VITE_FIREBASE_STORAGE_BUCKET=unit3quiz-v005-voting.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=205539035410
VITE_FIREBASE_APP_ID=1:205539035410:web:aeda3cb1cf1444a4774bcb
```

**Note**: The `.env` file is in `.gitignore` to keep your credentials secure.

## Install Dependencies

```bash
npm install
```

## Development

Run the development server:

```bash
npm run dev
```

## Build and Deploy

Build your application:

```bash
npm run build
```

Deploy to Firebase Hosting:

```bash
firebase deploy --only hosting
```

Or deploy everything (hosting + Firestore rules):

```bash
firebase deploy
```

## Using Firestore in Your App

The Firebase configuration is already set up in `src/firebase.js`. You can import and use Firestore like this:

```javascript
import { db } from './firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

// Example: Add a document
const addData = async () => {
  try {
    const docRef = await addDoc(collection(db, "your-collection"), {
      field1: "value1",
      field2: "value2"
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

// Example: Read documents
const readData = async () => {
  const querySnapshot = await getDocs(collection(db, "your-collection"));
  querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
  });
};
```

## Project Structure

```
.
├── src/
│   ├── firebase.js          # Firebase configuration and initialization
│   ├── App.jsx              # Main app component
│   └── ...
├── .firebaserc              # Firebase project configuration
├── firebase.json            # Firebase hosting and Firestore config
├── firestore.rules          # Firestore security rules
├── firestore.indexes.json   # Firestore indexes configuration
├── .env                     # Environment variables (already created)
└── package.json
```

## Firestore Security Rules

The default security rules in `firestore.rules` allow read/write access to all documents. **Modify these rules for production**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      // Current: Allow all reads/writes
      allow read, write: if true;
      
      // Production example: Require authentication
      // allow read, write: if request.auth != null;
    }
  }
}
```

Deploy updated rules:

```bash
firebase deploy --only firestore:rules
```

## Troubleshooting

### Firestore permission denied
- Make sure Firestore is enabled in Firebase Console
- Check your Firestore security rules
- Verify your `.env` file has the correct values

### Build fails
- Make sure you've installed dependencies: `npm install`
- Verify the `.env` file exists and has all required variables

### Deployment fails
- Ensure you're logged in: `firebase login`
- Verify project ID matches: `firebase projects:list`
- Check that you've built the project: `npm run build`

### Firebase CLI not found
Install Firebase CLI globally:
```bash
npm install -g firebase-tools
```

## Firebase Console Links

- **Project Overview**: https://console.firebase.google.com/project/unit3quiz-v005-voting/overview
- **Firestore Database**: https://console.firebase.google.com/project/unit3quiz-v005-voting/firestore
- **Hosting**: https://console.firebase.google.com/project/unit3quiz-v005-voting/hosting
- **Authentication**: https://console.firebase.google.com/project/unit3quiz-v005-voting/authentication

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Hosting Documentation](https://firebase.google.com/docs/hosting)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
