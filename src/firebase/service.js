import Config from 'react-native-config';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import the functions you need from the SDKs you need
import {getApp, getApps, initializeApp} from 'firebase/app';
import {
  getAuth,
  getReactNativePersistence,
  initializeAuth,
} from 'firebase/auth';
import {getFirestore, collection} from 'firebase/firestore';
import {getStorage, ref, uploadBytes, getDownloadURL} from 'firebase/storage';

// Initialize Firebase
const FIREBASE_CONFIG = {
  apiKey: Config.FIREBASE_API_KEY,
  authDomain: Config.FIREBASE_AUTH_DOMAIN,
  projectId: Config.FIREBASE_PROJECT_ID,
  storageBucket: Config.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: Config.FIREBASE_SENDER_ID,
  appId: Config.FIREBASE_APP_ID,
  // Add other configuration options as needed
};

// Initialize Firebase
let app, auth;

if (!getApps().length) {
  try {
    app = initializeApp(FIREBASE_CONFIG);
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (error) {
    console.log('Error initializing app: ' + error);
  }
} else {
  app = getApp();
  auth = getAuth(app);
}
export {auth};

// const app = initializeApp(FIREBASE_CONFIG);
// export const auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(AsyncStorage),
// });

// Initialize Firestore
export const db = getFirestore(app);
export const usersCollection = collection(db, 'users');
export const roomsCollection = collection(db, 'rooms');
export const storage = getStorage(app);
