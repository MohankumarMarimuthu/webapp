// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-805d5.firebaseapp.com",
  projectId: "mern-estate-805d5",
  storageBucket: "mern-estate-805d5.appspot.com",
  messagingSenderId: "275030213023",
  appId: "1:275030213023:web:313a77d40155bcb3f23daa"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);