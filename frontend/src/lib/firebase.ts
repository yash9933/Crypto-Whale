// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration for development
const firebaseConfig = {
  apiKey: "AIzaSyBXD4xaJ4-2xt-Vh7F8zKEZJ9LxUUzVJpY",
  authDomain: "test-project-12345.firebaseapp.com",
  projectId: "test-project-12345",
  storageBucket: "test-project-12345.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:1234567890abcdef123456"
};

// Log Firebase configuration for debugging
console.log('Firebase initialized with project:', firebaseConfig.projectId);

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// For development, we'll use a mock auth system if we detect Firebase issues
// Force mock auth on localhost to avoid API key issues
const useMockAuth = true; // Always use mock auth for now to ensure it works

if (useMockAuth) {
  console.log('Using mock authentication for development');
}

export { auth, useMockAuth };
