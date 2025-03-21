import React, { useState, useEffect, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import Upload from './components/Upload';
import PDFViewer from './components/PDFViewer';
import Summary from './components/Summary';
import Chat from './components/Chat';
import MindMap from './components/MindMap';
import Simplify from './components/Simplify';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword';
import Profile from './components/Auth/Profile';
import LoadingSpinner from './components/UI/LoadingSpinner';
import { AuthProvider, useAuth } from './utils/AuthContext';

// Create Theme Context
export const ThemeContext = createContext({
  darkMode: false,
  toggleDarkMode: () => {},
});

// PrivateRoute component to protect authenticated routes
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner 
          size="lg" 
          message="Authenticating..." 
        />
      </div>
    );
  }

  if (!user) {
    // Redirect to login if not authenticated, but save the attempted path
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

function App() {
  const [pdfData, setPdfData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    // Check if user has previously set darkMode in localStorage
    const savedTheme = localStorage.getItem('darkMode');
    // Check for system preference if no saved theme
    const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return savedTheme ? JSON.parse(savedTheme) : systemPrefersDark;
  });
  
  // Toggle sidebar function
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // If PDF is uploaded, store the data and navigate to the viewer
  const handlePdfUpload = (data) => {
    setPdfData(data);
    // Make pdfData globally accessible
    window.pdfData = data;
  };

  // Ensure window.pdfData is always in sync with state
  useEffect(() => {
    window.pdfData = pdfData;
  }, [pdfData]);

  // Toggle dark mode function
  const toggleDarkMode = () => {
    setDarkMode(prevMode => {
      const newMode = !prevMode;
      localStorage.setItem('darkMode', JSON.stringify(newMode));
      return newMode;
    });
  };

  // Apply dark mode class to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Handle body scroll when sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [sidebarOpen]);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <AuthProvider>
        <Router>
          <div className={`app-container ${darkMode ? 'dark' : ''} min-h-screen flex flex-col`}>
            <Header toggleSidebar={toggleSidebar} />
            <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
            <main className="main-content flex-grow">
              <Routes>
                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/profile" element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                } />
                
                {/* Home and Upload Routes */}
                <Route path="/" element={
                  <PrivateRoute>
                    <Upload onPdfUpload={handlePdfUpload} existingPdfData={pdfData} />
                  </PrivateRoute>
                } />
                <Route path="/upload" element={
                  <PrivateRoute>
                    <Upload onPdfUpload={handlePdfUpload} existingPdfData={pdfData} />
                  </PrivateRoute>
                } />
                
                {/* PDF Viewer Routes */}
                <Route path="/view" element={<Navigate to="/pdf/view" />} />
                <Route path="/pdf/view" element={
                  <PrivateRoute>
                    <PDFViewer pdfData={pdfData} />
                  </PrivateRoute>
                } />
                <Route path="/pdf/:id" element={
                  <PrivateRoute>
                    <PDFViewer pdfData={pdfData} />
                  </PrivateRoute>
                } />
                
                {/* Analysis Tool Routes */}
                <Route path="/summary" element={
                  <PrivateRoute>
                    <Summary pdfData={pdfData} />
                  </PrivateRoute>
                } />
                <Route path="/chat" element={
                  <PrivateRoute>
                    <Chat pdfData={pdfData} />
                  </PrivateRoute>
                } />
                <Route path="/mindmap" element={
                  <PrivateRoute>
                    <MindMap pdfData={pdfData} />
                  </PrivateRoute>
                } />
                <Route path="/mindmap/:id" element={
                  <PrivateRoute>
                    <MindMap pdfData={pdfData} />
                  </PrivateRoute>
                } />
                <Route path="/simplify" element={
                  <PrivateRoute>
                    <Simplify pdfData={pdfData} />
                  </PrivateRoute>
                } />
                
                {/* Fallback for unknown routes */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeContext.Provider>
  );
}

export default App; 