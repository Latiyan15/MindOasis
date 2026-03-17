// Firebase initialization file
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// This comes from parsing the environment variables provided by the user
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase only if config is provided
let app, db, storage, auth;

try {
  if (firebaseConfig.apiKey && firebaseConfig.apiKey !== 'your_api_key_here') {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    storage = getStorage(app);
    auth = getAuth(app);
    console.log("Firebase optionally initialized");
  } else {
    console.warn("Firebase config is missing or incomplete. Running in Local-Only mode.");
  }
} catch (error) {
  console.error("Firebase initialization error", error);
}

export { app, db, storage, auth };
