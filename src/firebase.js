import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// Values fall back to your original hard-coded config so the app
// works immediately. For production, put these in a .env file
// instead (see .env.example) so the config isn't committed to git.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyCjMXsQIW57itYnjHwatUngjyQjlmOZkp0',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'rh-poultry.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'rh-poultry',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'rh-poultry.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '822125658340',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:822125658340:web:beb25fb48cd5aeba5e2cf1',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-JDP305YV8P',
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
