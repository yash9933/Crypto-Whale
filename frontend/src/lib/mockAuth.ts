// Mock authentication service for development
import { UserCredential, User } from 'firebase/auth';

// Mock user data
const mockUsers = [
  {
    uid: 'test-user-123',
    email: 'test@example.com',
    password: 'password123',
    displayName: 'Test User'
  },
  {
    uid: 'user-456',
    email: 'josephdclarkjobs@gmail.com',
    password: 'password123',
    displayName: 'Joseph Clark'
  },
  {
    uid: 'user-789',
    email: 'josephdclarkjobs+1@gmail.com',
    password: 'password123',
    displayName: 'Joseph Clark'
  }
];

// Mock user storage in localStorage
const STORAGE_KEY = 'cryptowhale_mock_auth';

// Mock Firebase User class
class MockUser implements User {
  uid: string;
  email: string | null;
  emailVerified: boolean = true;
  displayName: string | null;
  isAnonymous: boolean = false;
  photoURL: string | null = null;
  providerData: any[] = [];
  providerId: string = 'password'; // Added missing property
  
  constructor(userData: { uid: string; email: string; displayName?: string }) {
    this.uid = userData.uid;
    this.email = userData.email;
    this.displayName = userData.displayName || null;
  }

  // Implement required methods
  delete(): Promise<void> {
    return Promise.resolve();
  }

  getIdToken(): Promise<string> {
    return Promise.resolve('mock-token-' + this.uid);
  }

  getIdTokenResult(): Promise<any> {
    return Promise.resolve({
      token: 'mock-token-' + this.uid,
      signInProvider: 'password',
      expirationTime: new Date(Date.now() + 3600000).toISOString()
    });
  }

  reload(): Promise<void> {
    return Promise.resolve();
  }

  toJSON(): object {
    return {
      uid: this.uid,
      email: this.email,
      displayName: this.displayName,
      emailVerified: this.emailVerified,
      isAnonymous: this.isAnonymous,
      photoURL: this.photoURL,
      providerData: this.providerData,
      providerId: this.providerId
    };
  }

  // Additional properties required by User interface
  phoneNumber: string | null = null;
  tenantId: string | null = null;
  metadata: any = {
    creationTime: new Date().toISOString(),
    lastSignInTime: new Date().toISOString()
  };
  refreshToken: string = 'mock-refresh-token';
  
  // Additional methods
  updateProfile(): Promise<void> {
    return Promise.resolve();
  }
  
  verifyBeforeUpdateEmail(): Promise<void> {
    return Promise.resolve();
  }
  
  linkWithCredential(): Promise<UserCredential> {
    return Promise.resolve({
      user: this,
      providerId: 'password',
      operationType: 'link'
    } as UserCredential);
  }
  
  unlink(): Promise<User> {
    return Promise.resolve(this as User);
  }
  
  updateEmail(): Promise<void> {
    return Promise.resolve();
  }
  
  updatePassword(): Promise<void> {
    return Promise.resolve();
  }
  
  reauthenticateWithCredential(): Promise<UserCredential> {
    return Promise.resolve({
      user: this,
      providerId: 'password',
      operationType: 'reauthenticate'
    } as UserCredential);
  }
  
  sendEmailVerification(): Promise<void> {
    return Promise.resolve();
  }
}

// Create a type that matches UserCredential structure
type MockUserCredentialType = {
  user: User;
  providerId: string | null;
  operationType: string;
};

// Get current user from localStorage
export function getCurrentUser(): MockUser | null {
  const userData = localStorage.getItem(STORAGE_KEY);
  if (userData) {
    const parsedData = JSON.parse(userData);
    return new MockUser(parsedData);
  }
  return null;
}

// Sign up with email and password
export async function mockSignUp(email: string, password: string): Promise<UserCredential> {
  // Check if user already exists
  const existingUser = mockUsers.find(user => user.email === email);
  if (existingUser) {
    const error = new Error('Email already in use');
    (error as any).code = 'auth/email-already-in-use';
    throw error;
  }

  // Create new user
  const newUser = {
    uid: 'user-' + Date.now(),
    email,
    password,
    displayName: email.split('@')[0]
  };
  
  // Add to mock users
  mockUsers.push(newUser);
  
  // Create user object
  const mockUser = new MockUser(newUser);
  
  // Store in localStorage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockUser));
  
  // Return user credential
  const credential: MockUserCredentialType = {
    user: mockUser,
    providerId: 'password',
    operationType: 'signIn'
  };
  
  return credential as UserCredential;
}

// Sign in with email and password
export async function mockSignIn(email: string, password: string): Promise<UserCredential> {
  // Find user
  const user = mockUsers.find(user => user.email === email);
  
  // Check if user exists
  if (!user) {
    const error = new Error('User not found');
    (error as any).code = 'auth/user-not-found';
    throw error;
  }
  
  // Check password
  if (user.password !== password) {
    const error = new Error('Wrong password');
    (error as any).code = 'auth/wrong-password';
    throw error;
  }
  
  // Create user object
  const mockUser = new MockUser(user);
  
  // Store in localStorage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockUser));
  
  // Return user credential
  const credential: MockUserCredentialType = {
    user: mockUser,
    providerId: 'password',
    operationType: 'signIn'
  };
  
  return credential as UserCredential;
}

// Sign out
export async function mockSignOut(): Promise<void> {
  localStorage.removeItem(STORAGE_KEY);
  return Promise.resolve();
}

// Update profile
export async function mockUpdateProfile(user: MockUser, profile: { displayName?: string }): Promise<void> {
  if (profile.displayName) {
    user.displayName = profile.displayName;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }
  return Promise.resolve();
}

// Reset password
export async function mockResetPassword(email: string): Promise<void> {
  const user = mockUsers.find(user => user.email === email);
  if (!user) {
    const error = new Error('User not found');
    (error as any).code = 'auth/user-not-found';
    throw error;
  }
  return Promise.resolve();
}

// Add test user if not exists
export function ensureTestUser(): void {
  const testUser = mockUsers.find(user => user.email === 'test@example.com');
  if (!testUser) {
    mockUsers.push({
      uid: 'test-user-123',
      email: 'test@example.com',
      password: 'password123',
      displayName: 'Test User'
    });
  }
}

// Initialize - ensure test user exists
ensureTestUser();
