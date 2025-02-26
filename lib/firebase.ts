import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDVzN86ajIZ_qnJoioI5VcFKgFWREv58js",
  authDomain: "pointdeck-548ed.firebaseapp.com",
  projectId: "pointdeck-548ed",
  storageBucket: "pointdeck-548ed.firebasestorage.app",
  messagingSenderId: "1091822528716",
  appId: "1:1091822528716:web:2410b6f0ff981b014d3a69",
  measurementId: "G-DWR60ERXL2"
};

let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const db: Firestore = getFirestore(app);

export { db };