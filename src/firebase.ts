import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBkkFF0XhNZeWuDmOfEhsgNxyozGKVHZtU",
  authDomain: "prestamos-app-xxxx.firebaseapp.com",
  projectId: "prestamos-app-xxxx",
  storageBucket: "prestamos-app-xxxx.appspot.com",
  messagingSenderId: "xxxxxxxxxxxxx",
  appId: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);