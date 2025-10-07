// Import the Firebase modules you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Your Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC1BhH7XnTcSLfpzf91QyjO1WljjgaKMlg",
  authDomain: "rakshita-group-8.firebaseapp.com",
  projectId: "rakshita-group-8",
  storageBucket: "rakshita-group-8.firebasestorage.app",
  messagingSenderId: "823174554265",
  appId: "1:823174554265:web:1aba0d7992ec7c022b0e08",
  measurementId: "G-KT71NGM69X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services you need
export const db = getFirestore(app);
export const auth = getAuth(app);

// changed while testing changes
console.log("✅ Firebase configuration loaded successfully.");

// Test Firebase initialization
try {
  console.log("Firebase App Name:", app.name);
  console.log("Firebase App Config:", app.options);
  console.log("Firestore instance:", getFirestore(app));
  console.log("Auth instance:", getAuth(app));
  console.log("🔥 Firebase is connected properly!");
} catch (error) {
  console.error("❌ Firebase connection failed:", error);
}
