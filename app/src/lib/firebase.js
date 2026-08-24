import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Same public client config as ../../firebase-config.js at the repo root
// (kept in sync manually — this app owns the runtime copy).
const firebaseConfig = {
  apiKey: 'AIzaSyCabOhScJEoa96NrOuFBv6De_8zAi2Uh8E',
  authDomain: 'airmoon-d9620.firebaseapp.com',
  projectId: 'airmoon-d9620',
  storageBucket: 'airmoon-d9620.firebasestorage.app',
  messagingSenderId: '697264069553',
  appId: '1:697264069553:web:d3cbc6c2c98a3a82d87b90',
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
