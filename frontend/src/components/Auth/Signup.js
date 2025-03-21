import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';
import LoadingSpinner from '../UI/LoadingSpinner';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { signup, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccessMessage('');

    // Form validation
    if (!email || !password || !confirmPassword) {
      setFormError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setFormError('Password must be at least 6 characters');
      return;
    }

    try {
      const { error, data } = await signup(email, password);
      
      if (error) {
        setFormError(error.message);
        return;
      }
      
      setSuccessMessage('Account created! Please check your email to confirm your account.');
      
      // If the signup doesn't require email confirmation, redirect to login
      if (data?.user && !data?.session) {
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else if (data?.session) {
        // If user is automatically signed in
        navigate('/');
      }
    } catch (err) {
      setFormError('An unexpected error occurred');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-gradient-to-br from-blue-900 to-purple-900">
      {/* Left side - 3D Robot Visualization */}
      <div className="hidden md:flex flex-col items-center justify-center p-10 bg-gradient-to-br from-indigo-800 to-purple-900">
        <div className="relative w-full max-w-md h-80">
          <img
            src="/images/robot-analyzing.png"
            alt="AI Robot analyzing documents"
            className="object-contain w-full h-full"
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none';
              // Show SVG fallback if image fails to load
              const fallbackEl = document.getElementById('robot-fallback');
              if (fallbackEl) fallbackEl.style.display = 'block';
            }}
          />
          <div id="robot-fallback" className="hidden absolute inset-0 flex items-center justify-center">
            <svg className="w-full h-full text-indigo-300" fill="currentColor" viewBox="0 0 100 100">
              <circle cx="50" cy="30" r="20" />
              <rect x="30" y="55" width="40" height="40" rx="5" />
              <circle cx="40" cy="65" r="5" fill="blue" />
              <circle cx="60" cy="65" r="5" fill="blue" />
              <path d="M40 80 L60 80" stroke="white" strokeWidth="2" />
            </svg>
          </div>
        </div>
        <div className="text-center mt-8">
          <h1 className="text-4xl font-bold text-white mb-4">PDF Analyzer</h1>
          <p className="text-indigo-200 text-lg max-w-md">
            Create an account to start analyzing your documents with AI-powered tools.
          </p>
        </div>
      </div>
        
      {/* Right side - Signup Form */}
      <div className="flex flex-col items-center justify-center p-4 md:p-10">
        <div className="w-full max-w-md p-8 bg-gray-900 rounded-2xl shadow-xl">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-white">Create Account</h2>
            <p className="text-gray-400 mt-2">
              Join our community of PDF analysts
            </p>
          </div>
          
          {formError && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
              {formError}
            </div>
          )}
          
          {successMessage && (
            <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-200 text-sm">
              {successMessage}
            </div>
          )}
          
          <form onSubmit={handleSignup} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors text-white"
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors text-white"
                placeholder="Create a password"
              />
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-400 mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors text-white"
                placeholder="Confirm your password"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg shadow-lg transform transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <LoadingSpinner size="sm" color="white" />
                  <span className="ml-2">Creating account...</span>
                </span>
              ) : (
                'Create Account'
              )}
            </button>
            
            <div className="text-center mt-6">
              <p className="text-gray-400 text-sm">
                Already have an account?{' '}
                <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup; 