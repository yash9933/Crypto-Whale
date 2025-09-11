import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  UserCredential
} from 'firebase/auth';
import { auth, useMockAuth } from '../lib/firebase';
import { 
  mockSignIn, 
  mockSignUp, 
  mockSignOut, 
  mockUpdateProfile, 
  mockResetPassword,
  getCurrentUser
} from '../lib/mockAuth';

// User type definition
interface User {
  uid: string;
  email: string | null;
  displayName?: string | null;
}

type AuthContextType = {
  currentUser: FirebaseUser | null;
  userProfile: User | null;
  loading: boolean;
  signup: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (displayName: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function signup(email: string, password: string) {
    console.log('Signup function called with:', email);
    
    try {
      let user;
      
      if (useMockAuth) {
        // Use mock authentication
        const result = await mockSignUp(email, password);
        user = result.user;
      } else {
        // Use Firebase authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        user = userCredential.user;
      }
      
      // Create a simple user profile in memory
      setUserProfile({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName
      });
    } catch (error: any) {
      console.error('Signup error:', error);
      throw error;
    }
  }

  async function login(email: string, password: string): Promise<UserCredential> {
    console.log('Login function called with:', email);
    
    try {
      if (useMockAuth) {
        // Use mock authentication
        try {
          const result = await mockSignIn(email, password);
          console.log('Mock login successful for:', email);
          return result;
        } catch (mockError: any) {
          console.error('Mock login error:', mockError.message);
          
          // If the user doesn't exist in mock system but it's the test user or the user's email (including variations),
          // create it automatically for convenience
          if (mockError.message.includes('not found') && 
              (email === 'test@example.com' || 
               email.includes('josephdclarkjobs') || 
               email.includes('josephdclarkjobs+1'))) {
            console.log('User not found in mock system, creating automatically:', email);
            try {
              const signupResult = await mockSignUp(email, password);
              console.log('Auto-created user in mock system:', email);
              return signupResult;
            } catch (createError) {
              console.error('Error auto-creating user in mock system:', createError);
              throw mockError; // Throw the original error if creation fails
            }
          } else {
            throw mockError;
          }
        }
      } else {
        // Use Firebase authentication
        return await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      // If Firebase fails with API key error, try mock auth as fallback
      if (!useMockAuth && (error.code === 'auth/api-key-not-valid' || error.code === 'auth/invalid-api-key')) {
        console.log('Firebase auth failed, falling back to mock auth');
        try {
          const result = await mockSignIn(email, password);
          return result;
        } catch (mockError: any) {
          // If the user doesn't exist in mock system but it's the test user or the user's email (including variations),
          // create it automatically for convenience
          if (mockError.message.includes('not found') && 
              (email === 'test@example.com' || 
               email.includes('josephdclarkjobs') || 
               email.includes('josephdclarkjobs+1'))) {
            console.log('User not found in mock system, creating automatically:', email);
            const signupResult = await mockSignUp(email, password);
            console.log('Auto-created user in mock system:', email);
            return signupResult;
          } else {
            throw mockError;
          }
        }
      }
      
      throw error;
    }
  }

  async function logout() {
    if (useMockAuth) {
      // Use mock authentication
      return await mockSignOut();
    } else {
      // Use Firebase authentication
      return await signOut(auth);
    }
  }

  async function resetPassword(email: string) {
    if (useMockAuth) {
      // Use mock authentication
      return await mockResetPassword(email);
    } else {
      // Use Firebase authentication
      return await sendPasswordResetEmail(auth, email);
    }
  }

  async function updateUserProfile(displayName: string) {
    if (!currentUser) return;
    
    if (useMockAuth) {
      // Use mock authentication
      await mockUpdateProfile(currentUser as any, { displayName });
    } else {
      // Use Firebase authentication
      await updateProfile(currentUser, { displayName });
    }
    
    // Update local user profile state
    if (userProfile) {
      setUserProfile({
        ...userProfile,
        displayName
      });
    }
  }

  useEffect(() => {
    if (useMockAuth) {
      // For mock auth, check localStorage
      const mockUser = getCurrentUser();
      console.log('Mock auth state:', mockUser ? `User ${mockUser.email} logged in` : 'User logged out');
      
      setCurrentUser(mockUser as any);
      if (mockUser) {
        setUserProfile({
          uid: mockUser.uid,
          email: mockUser.email,
          displayName: mockUser.displayName
        });
      } else {
        setUserProfile(null);
      }
      setLoading(false);
      
      // No unsubscribe needed for mock auth
      return () => {};
    } else {
      // For Firebase auth, use onAuthStateChanged
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        console.log('Auth state changed:', user ? `User ${user.email} logged in` : 'User logged out');
        setCurrentUser(user);
        
        if (user) {
          // Create a simple user profile in memory
          setUserProfile({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName
          });
        } else {
          setUserProfile(null);
        }
        
        setLoading(false);
      });
      
      return unsubscribe;
    }
  }, []);

  const value = {
    currentUser,
    userProfile,
    loading,
    signup,
    login,
    logout,
    resetPassword,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
