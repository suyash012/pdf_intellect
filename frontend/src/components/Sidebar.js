import React, { useState, useContext, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ThemeContext } from '../App';
import { useAuth } from '../utils/AuthContext';
import supabase from '../utils/supabaseClient';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [recentPdfs, setRecentPdfs] = useState([]);
  const [recentChats, setRecentChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserData();
    } else {
      setRecentPdfs([]);
      setRecentChats([]);
      setLoading(false);
    }
  }, [user]);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      // Fetch the user's PDFs
      const { data: pdfs, error: pdfError } = await supabase
        .from('pdfs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (pdfError) throw pdfError;
      
      // Fetch the user's chats
      const { data: chats, error: chatError } = await supabase
        .from('chats')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (chatError) throw chatError;
      
      setRecentPdfs(pdfs || []);
      setRecentChats(chats || []);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    toggleSidebar(); // Close sidebar on logout
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed top-0 left-0 h-full w-80 bg-white dark:bg-gray-900 shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } overflow-y-auto`}
      >
        {/* Close button */}
        <button 
          onClick={toggleSidebar}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* Profile section */}
        <div className="p-5 border-b border-gray-200 dark:border-gray-700">
          {user ? (
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                {user.email.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user.email}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Signed in
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col space-y-2">
              <Link 
                to="/login"
                className="w-full py-2 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center font-medium rounded-lg"
                onClick={toggleSidebar}
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="w-full py-2 px-4 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 text-center font-medium rounded-lg"
                onClick={toggleSidebar}
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
        
        {/* Recent PDFs */}
        <div className="p-5 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Recent PDFs
          </h3>
          <div className="space-y-3">
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : recentPdfs.length > 0 ? (
              recentPdfs.map(pdf => (
                <Link
                  key={pdf.id}
                  to={`/pdf/${pdf.id}`}
                  className="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  onClick={toggleSidebar}
                >
                  <div className="flex-shrink-0 mr-3">
                    <svg className="w-9 h-9 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {pdf.title || pdf.filename || 'Untitled PDF'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatTimeAgo(pdf.created_at)}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">
                No PDFs yet
              </p>
            )}
            
            <Link
              to="/upload"
              className="flex items-center justify-center p-2 mt-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              onClick={toggleSidebar}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="text-sm font-medium">Upload New PDF</span>
            </Link>
          </div>
        </div>
        
        {/* Recent Chats */}
        <div className="p-5 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Recent Chats
          </h3>
          <div className="space-y-3">
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-purple-500"></div>
              </div>
            ) : recentChats.length > 0 ? (
              recentChats.map(chat => (
                <Link
                  key={chat.id}
                  to={`/chat?id=${chat.id}`}
                  className="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  onClick={toggleSidebar}
                >
                  <div className="flex-shrink-0 mr-3">
                    <svg className="w-9 h-9 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {chat.title || 'Untitled Chat'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatTimeAgo(chat.created_at)}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">
                No chats yet
              </p>
            )}
            
            <Link
              to="/chat"
              className="flex items-center justify-center p-2 mt-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-purple-600 dark:text-purple-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              onClick={toggleSidebar}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="text-sm font-medium">Start New Chat</span>
            </Link>
          </div>
        </div>
        
        {/* Settings */}
        <div className="p-5 space-y-4">
          {/* Theme Toggle */}
          <div 
            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
            onClick={toggleDarkMode}
          >
            <div className="flex items-center">
              {darkMode ? (
                <svg className="w-5 h-5 text-yellow-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" 
                  />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-indigo-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" 
                  />
                </svg>
              )}
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                {darkMode ? 'Light Mode' : 'Dark Mode'}
              </span>
            </div>
            <div className={`w-11 h-6 bg-gray-200 rounded-full px-1 flex items-center ${darkMode ? 'justify-end bg-indigo-600' : 'justify-start'} transition-all`}>
              <div className="bg-white w-4 h-4 rounded-full shadow-md transform transition-transform"></div>
            </div>
          </div>
          
          {/* Profile Settings */}
          {user && (
            <>
              <Link 
                to="/profile"
                className="flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={toggleSidebar}
              >
                <svg className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Profile Settings
                </span>
              </Link>
              
              {/* Logout */}
              <button 
                onClick={handleLogout}
                className="w-full flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-left"
              >
                <svg className="w-5 h-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="text-sm font-medium text-red-500">
                  Sign Out
                </span>
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar; 