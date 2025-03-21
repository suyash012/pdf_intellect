import React, { createContext, useState, useEffect, useContext } from 'react';
import supabase from './supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check for active session when component mounts
    const checkSession = async () => {
      setLoading(true);
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (session) {
          const { data: { user }, error } = await supabase.auth.getUser();
          if (error) throw error;
          setUser(user);
        }
      } catch (error) {
        console.error('Error checking auth session:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session && session.user) {
          setUser(session.user);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    // Clean up subscription on unmount
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // Login with email and password
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email, 
        password
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error logging in:', error);
      setError(error.message);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  // Signup with email and password
  const signup = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error signing up:', error);
      setError(error.message);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error resetting password:', error);
      setError(error.message);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  // Complete password reset with new password
  const completePasswordReset = async (token, newPassword) => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error completing password reset:', error);
      setError(error.message);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  // Update user's password
  const updatePassword = async (oldPassword, newPassword) => {
    setLoading(true);
    setError(null);
    try {
      // First verify old password by attempting a silent login
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: oldPassword,
      });
      
      if (loginError) {
        throw new Error('Current password is incorrect');
      }
      
      // Then update to new password
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error updating password:', error);
      setError(error.message);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  // Delete user account
  const deleteAccount = async () => {
    setLoading(true);
    setError(null);
    try {
      // This is a simplified implementation
      // In a real application, you might want to:
      // 1. Delete user's data from other tables first
      // 2. Use a server-side function to delete the user with admin privileges
      
      const { error } = await supabase.rpc('delete_user_account');
      
      if (error) throw error;
      
      // Sign out after successful deletion
      await supabase.auth.signOut();
      setUser(null);
      return { success: true };
    } catch (error) {
      console.error('Error deleting account:', error);
      setError(error.message);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    resetPassword,
    completePasswordReset,
    updatePassword,
    deleteAccount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 