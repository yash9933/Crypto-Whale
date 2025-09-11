import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiAlertTriangle } from 'react-icons/fi';
import { auth } from '../lib/firebase';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Logo
import WhaleIcon from '../assets/whale-icon.svg';

export const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authStatus, setAuthStatus] = useState('');
  const { signup, updateUserProfile } = useAuth();
  const navigate = useNavigate();

  // Check if Firebase Auth is initialized
  useEffect(() => {
    if (auth) {
      setAuthStatus('Firebase Auth is initialized');
    } else {
      setAuthStatus('Firebase Auth is NOT initialized');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!fullName || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      console.log('Attempting to register with:', { email, password });
      
      // Create user account
      await signup(email, password);
      console.log('User account created successfully');
      
      // Update user profile with display name
      await updateUserProfile(fullName);
      console.log('User profile updated with display name');
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Registration error:', err);
      
      // Provide more specific error messages
      if (err.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address format');
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak. Please use a stronger password');
      } else {
        setError(err.message || 'Failed to create an account');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-900 text-white border-gray-800">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="w-16 h-16 mb-2">
            <img src={WhaleIcon} alt="CryptoWhale Logo" className="w-full h-full" />
          </div>
          <CardTitle className="text-2xl text-center bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent">
            CryptoWhale
          </CardTitle>
          <CardDescription className="text-gray-400 text-center">
            Create your account
          </CardDescription>
          {authStatus && (
            <div className="text-xs mt-2 bg-gray-800 px-2 py-1 rounded text-gray-400">
              Status: {authStatus}
            </div>
          )}
        </CardHeader>

        {error && (
          <div className="px-6">
            <Alert className="bg-red-900/30 border-red-800 text-red-300 mb-4">
              <FiAlertTriangle className="h-4 w-4 mr-2" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-gray-300">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">Password</Label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-gray-800 border-gray-700 text-white"
              />
              <p className="text-xs text-gray-500">Password must be at least 6 characters</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-300">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-cyan-500 hover:text-cyan-400">
              Sign in
            </Link>
          </div>
          
          <div className="text-xs text-gray-500 text-center">
            Test Account: test@example.com / password123
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
