import { auth, useMockAuth } from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, AuthErrorCodes } from 'firebase/auth';
import { mockSignIn, mockSignUp } from './mockAuth';

// Function to initialize the app with a test user
export async function initializeTestUser() {
  try {
    // Test user credentials
    const testEmail = 'test@example.com';
    const testPassword = 'password123';
    
    console.log('Attempting to sign in with test user...');
    
    if (useMockAuth) {
      // Use mock authentication for development
      try {
        await mockSignIn(testEmail, testPassword);
        console.log('Test user sign in successful (mock)');
      } catch (error: any) {
        console.log('Mock sign in error:', error.message);
        
        if (error.message.includes('not found')) {
          console.log('Test user not found, creating in mock system...');
          try {
            await mockSignUp(testEmail, testPassword);
            console.log('Test user created successfully in mock system!');
          } catch (createError: any) {
            console.error('Error creating test user in mock system:', createError.message);
          }
        }
      }
      
      // Sign out after initialization to let the user sign in manually
      try {
        await auth.signOut();
        console.log('Signed out after initialization');
      } catch (signOutError) {
        console.log('Error signing out:', signOutError);
      }
      
      return { email: testEmail, password: testPassword };
    } else {
      // Use real Firebase authentication
      try {
        // Try to sign in with test user credentials
        await signInWithEmailAndPassword(auth, testEmail, testPassword);
        console.log('Test user sign in successful');
      } catch (error: any) {
        console.log('Sign in error code:', error.code);
        
        // If the user doesn't exist, create it
        if (error.code === 'auth/user-not-found') {
          console.log('Test user not found, creating...');
          try {
            // Create the test user in Firebase Auth
            await createUserWithEmailAndPassword(auth, testEmail, testPassword);
            console.log('Test user created successfully!');
          } catch (createError: any) {
            console.log('Create user error code:', createError.code);
            
            if (createError.code === 'auth/email-already-in-use') {
              console.log('Test user already exists but sign-in failed. Check password.');
            } else {
              console.error('Error creating test user:', createError.message);
            }
          }
        } else if (error.code === 'auth/invalid-credential' || 
                  error.code === 'auth/wrong-password') {
          console.log('Invalid credentials for test user');
        } else if (error.code === 'auth/network-request-failed') {
          console.log('Network error - check your internet connection');
        } else if (error.code === 'auth/api-key-not-valid') {
          console.error('Firebase API key is not valid. Please check your Firebase configuration.');
        } else {
          console.error('Error signing in test user:', error.message);
        }
      }
      
      try {
        // Sign out after initialization to let the user sign in manually
        await auth.signOut();
        console.log('Signed out after initialization');
      } catch (signOutError) {
        console.log('Error signing out:', signOutError);
      }
      
      return { email: testEmail, password: testPassword };
    }
  } catch (error: any) {
    console.error('Error initializing test user:', error.message);
    return { email: 'test@example.com', password: 'password123', error: error.message };
  }
}
