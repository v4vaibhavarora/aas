// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// This is your actual configuration object
const firebaseConfig = {
  apiKey: "AIzaSyDTljdeWFUug01kbt6UskyFvXGgP3VJXEM",
  authDomain: "attendancesystem-1ab90.firebaseapp.com",
  projectId: "attendancesystem-1ab90",
  storageBucket: "attendancesystem-1ab90.appspot.com",
  messagingSenderId: "237450816952",
  appId: "1:237450816952:web:35fce7b42ae2774f78734d",
  measurementId: "G-2LYEYFTVBB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export firestore database instance so we can use it in other files
export const db = getFirestore(app);