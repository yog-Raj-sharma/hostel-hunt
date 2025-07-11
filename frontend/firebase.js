// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCHDKrPexxjZfnI-_NtVUixygfgjEMKPUk",
  authDomain: "hostel-hunt-image-container.firebaseapp.com",
  projectId: "hostel-hunt-image-container",
  storageBucket: "hostel-hunt-image-container.firebasestorage.app",
  messagingSenderId: "422643309535",
  appId: "1:422643309535:web:234963704cc0f7e213c26a",
  measurementId: "G-YC39WB9VEH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);