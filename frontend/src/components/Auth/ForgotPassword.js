import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';
import LoadingSpinner from '../UI/LoadingSpinner';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { resetPassword, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccessMessage('');

    if (!email) {
      setFormError('Please enter your email address');
      return;
    }

    try {
      const { error, success } = await resetPassword(email);
      
      if (error) {
        setFormError(error.message);
        return;
      }
      
      setSuccessMessage('Password reset instructions have been sent to your email.');
    } catch (err) {
      setFormError('An unexpected error occurred');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900 p-4">
      <div className="bg-gray-900 text-white p-8 rounded-2xl shadow-2xl max-w-md w-full">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
        </div>
        
        <h2 className="text-3xl font-bold mb-2 text-center">Reset Password</h2>
        <p className="text-gray-400 text-center mb-8">
          Enter your email and we'll send you instructions to reset your password
        </p>
        
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
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors text-white"
              placeholder="Enter your registered email"
              required
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
                <span className="ml-2">Sending...</span>
              </span>
            ) : (
              'Send Reset Instructions'
            )}
          </button>
          
          <div className="flex items-center justify-center space-x-4 mt-6">
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 text-sm">
              Back to Sign In
            </Link>
            <span className="text-gray-500">•</span>
            <Link to="/signup" className="text-indigo-400 hover:text-indigo-300 text-sm">
              Create Account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword; 