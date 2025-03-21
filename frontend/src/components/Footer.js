import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeContext } from '../App';
import Logo from './Logo';

function Footer() {
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext);
  
  const handleNavigation = (e, path) => {
    e.preventDefault();
    // If it's a hash link (like #features), handle it manually
    if (path.startsWith('#')) {
      const element = document.getElementById(path.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(path);
    }
  };
  
  return (
    <footer className="footer bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-200 transition-colors duration-300">
      <div className="footer-content max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-4 gap-8">
        <div className="footer-section md:col-span-2">
          <div className="mb-4">
            <Logo size="small" />
          </div>
          <p className="text-sm leading-relaxed mt-4">
            PDF Intellect is an advanced document analysis platform powered by AI. We help you analyze, 
            visualize, and extract valuable insights from your PDF documents through cutting-edge 
            natural language processing techniques.
          </p>
        </div>
        
        <div className="footer-section">
          <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Features</h3>
          <nav className="footer-nav flex flex-col space-y-2">
            <Link to="/upload" className="text-sm hover:text-indigo-600 dark:hover:text-indigo-400 dark:text-gray-300 transition-colors">Upload PDF</Link>
            <Link to="/chat" className="text-sm hover:text-indigo-600 dark:hover:text-indigo-400 dark:text-gray-300 transition-colors">Chat with PDF</Link>
            <Link to="/summary" className="text-sm hover:text-indigo-600 dark:hover:text-indigo-400 dark:text-gray-300 transition-colors">Summarize</Link>
            <Link to="/mindmap" className="text-sm hover:text-indigo-600 dark:hover:text-indigo-400 dark:text-gray-300 transition-colors">Mind Maps</Link>
            <Link to="/simplify" className="text-sm hover:text-indigo-600 dark:hover:text-indigo-400 dark:text-gray-300 transition-colors">Simplify Text</Link>
          </nav>
        </div>
        
        <div className="footer-section">
          <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Connect</h3>
          <nav className="footer-nav flex flex-col space-y-2">
            <a href="mailto:support@pdfintellect.com" className="text-sm hover:text-indigo-600 dark:hover:text-indigo-400 dark:text-gray-300 transition-colors flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email Support
            </a>
            <Link to="/login" className="text-sm hover:text-indigo-600 dark:hover:text-indigo-400 dark:text-gray-300 transition-colors flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Account
            </Link>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-indigo-600 dark:hover:text-indigo-400 dark:text-gray-300 transition-colors flex items-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
              </svg>
              GitHub
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-indigo-600 dark:hover:text-indigo-400 dark:text-gray-300 transition-colors flex items-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
              Twitter
            </a>
          </nav>
        </div>
      </div>
      
      <div className="border-t border-gray-200 dark:border-gray-700 mt-8">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:justify-between items-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} PDF Intellect. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link to="/privacy" className="text-sm text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 