import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';
import LoadingSpinner from '../UI/LoadingSpinner';

const Profile = () => {
  const { user, loading, logout, updatePassword, deleteAccount } = useAuth();
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setEmail(user.email);
    }
  }, [user]);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccessMessage('');
    
    // Validation
    if (!oldPassword) {
      setFormError('Current password is required');
      return;
    }
    
    if (newPassword && newPassword.length < 6) {
      setFormError('New password must be at least 6 characters long');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setFormError('New passwords do not match');
      return;
    }
    
    setIsUpdating(true);
    
    try {
      const { error } = await updatePassword(oldPassword, newPassword);
      
      if (error) {
        setFormError(error.message);
        setIsUpdating(false);
        return;
      }
      
      setSuccessMessage('Password updated successfully');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setFormError('An unexpected error occurred');
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
    
    if (confirmed) {
      setIsUpdating(true);
      try {
        const { error } = await deleteAccount();
        
        if (error) {
          setFormError(error.message);
          setIsUpdating(false);
          return;
        }
        
        // If successful, the user will be logged out and redirected by the AuthContext
      } catch (err) {
        setFormError('An unexpected error occurred');
        console.error(err);
        setIsUpdating(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" message="Loading profile..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 md:p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Account Settings</h1>
        
        {/* User Info Section */}
        <div className="flex items-center mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl mr-5">
            {user?.email.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">{email}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Account created on {new Date(user?.created_at || Date.now()).toLocaleDateString()}</p>
          </div>
        </div>
        
        {formError && (
          <div className="mb-6 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-700 dark:text-red-300 text-sm">
            {formError}
          </div>
        )}
        
        {successMessage && (
          <div className="mb-6 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-700 dark:text-green-300 text-sm">
            {successMessage}
          </div>
        )}
        
        {/* Change Password Section */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Change Password</h3>
          
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Current Password
              </label>
              <input
                id="oldPassword"
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors text-gray-900 dark:text-white"
              />
            </div>
            
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors text-gray-900 dark:text-white"
              />
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors text-gray-900 dark:text-white"
              />
            </div>
            
            <div>
              <button
                type="submit"
                disabled={isUpdating}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
              >
                {isUpdating ? (
                  <span className="flex items-center">
                    <LoadingSpinner size="sm" color="white" />
                    <span className="ml-2">Updating...</span>
                  </span>
                ) : (
                  'Update Password'
                )}
              </button>
            </div>
          </form>
        </div>
        
        {/* Account Management Section */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Account Management</h3>
          
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Deleting your account will remove all your data and cannot be undone.
          </p>
          
          <button
            onClick={handleDeleteAccount}
            disabled={isUpdating}
            className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
          >
            {isUpdating ? (
              <span className="flex items-center">
                <LoadingSpinner size="sm" color="white" />
                <span className="ml-2">Processing...</span>
              </span>
            ) : (
              'Delete Account'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile; 