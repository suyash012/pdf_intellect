import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';
import LoadingSpinner from '../UI/LoadingSpinner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [formError, setFormError] = useState('');
  const { login, user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If user is already logged in, redirect to home or intended page
    if (user) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!email || !password) {
      setFormError('Please enter both email and password');
      return;
    }

    try {
      const { error } = await login(email, password);
      
      if (error) {
        setFormError(error.message);
        return;
      }
      
      // No need to navigate here - the useEffect will handle that once user state updates
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
            Welcome back! Sign in to access your AI-powered document analysis tools.
          </p>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex flex-col items-center justify-center p-4 md:p-10">
        <div className="w-full max-w-md p-8 bg-gray-900 rounded-2xl shadow-xl">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-white">Sign In</h2>
            <p className="text-gray-400 mt-2">
              Access your account to analyze PDFs
            </p>
          </div>

          {formError && (
            <div className="mb-6 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
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
                placeholder="Your email address"
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-400">
                  Password
                </label>
                <Link to="/forgot-password" className="text-sm text-indigo-400 hover:text-indigo-300">
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors text-white"
                placeholder="Your password"
              />
            </div>
            
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-600 rounded bg-gray-700"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg shadow-lg transform transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <LoadingSpinner size="sm" color="white" />
                  <span className="ml-2">Signing in...</span>
                </span>
              ) : (
                'Sign in'
              )}
            </button>
            
            <div className="text-center mt-6">
              <p className="text-gray-400 text-sm">
                Don't have an account?{' '}
                <Link to="/signup" className="text-indigo-400 hover:text-indigo-300 font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login; 