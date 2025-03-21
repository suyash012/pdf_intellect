import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useNavigate } from 'react-router-dom';
import Spinner from './Spinner';
import ChatComponent from './ChatComponent';

// Set worker path for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFViewer = ({ pdfData }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const navigate = useNavigate();
  
  // Add dropdown functionality
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [pdfError, setPdfError] = useState(null);

  useEffect(() => {
    if (!pdfData || !pdfData.filename) {
      navigate('/upload');
    }
    
    // Enable keyboard navigation
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        nextPage();
      } else if (e.key === 'ArrowLeft') {
        prevPage();
      } else if (e.key === '+') {
        zoomIn();
      } else if (e.key === '-') {
        zoomOut();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [pdfData, navigate, pageNumber, numPages]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest('.dropdown')) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setIsLoading(false);
  };

  const prevPage = () => {
    setPageNumber(page => (page > 1 ? page - 1 : page));
  };

  const nextPage = () => {
    setPageNumber(page => (page < numPages ? page + 1 : page));
  };

  const zoomIn = () => {
    setScale(prevScale => Math.min(prevScale + 0.2, 2.5));
  };

  const zoomOut = () => {
    setScale(prevScale => Math.max(prevScale - 0.2, 0.5));
  };

  const resetZoom = () => {
    setScale(1.0);
  };

  const enterFullScreen = () => {
    const element = document.documentElement;
    
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
    
    setIsFullScreen(true);
  };

  const exitFullScreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
    
    setIsFullScreen(false);
  };

  const toggleFullScreen = () => {
    if (isFullScreen) {
      exitFullScreen();
    } else {
      enterFullScreen();
    }
  };

  // Add dropdown functionality
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  if (!pdfData) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="pdf-container w-full flex flex-col items-center p-4 dark:bg-gray-800">
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">PDF Viewer</h1>
      {pdfError ? (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {pdfError}</span>
        </div>
      ) : null}
      
      <div className="w-full max-w-4xl bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 mb-6">
        {isLoading && (
          <div className="flex justify-center items-center h-96">
            <div className="loader rounded-full border-4 border-t-4 border-gray-200 dark:border-gray-600 border-t-indigo-500 dark:border-t-indigo-400 h-12 w-12 animate-spin"></div>
            <p className="ml-4 text-gray-600 dark:text-gray-300">Loading PDF...</p>
          </div>
        )}
        
        <Document
          file={pdfData.filename ? `http://localhost:8000/pdfs/${pdfData.filename}` : null}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={(error) => {
            setPdfError(error.message);
            setIsLoading(false);
          }}
          loading={null}
          className="flex flex-col items-center"
        >
          {!isLoading && (
            <Page
              pageNumber={pageNumber}
              width={Math.min(window.innerWidth * 0.8, 800)}
              renderTextLayer={true}
              renderAnnotationLayer={false}
              onRenderSuccess={() => setIsLoading(false)}
              className="pdf-page"
            />
          )}
        </Document>

        {numPages && !isLoading && (
          <div className="pagination-controls flex flex-col md:flex-row justify-between items-center w-full mt-4 p-2 bg-gray-100 dark:bg-gray-600 rounded">
            <div className="flex">
              <button
                className="bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded mr-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={pageNumber <= 1}
                onClick={() => setPageNumber(pageNumber - 1)}
              >
                Previous
              </button>
              <button
                className="bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={pageNumber >= numPages}
                onClick={() => setPageNumber(pageNumber + 1)}
              >
                Next
              </button>
            </div>
            <p className="text-gray-700 dark:text-gray-200 mt-2 md:mt-0">
              Page {pageNumber} of {numPages}
            </p>
          </div>
        )}
      </div>
      
      {/* PDF Toolbar */}
      <div className="card mb-4 sticky top-16 z-10 scale-in bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
        <div className="card-body p-4 flex flex-wrap gap-3 items-center justify-between">
          <div className="flex items-center space-x-3">
            <button 
              onClick={prevPage} 
              disabled={pageNumber <= 1}
              className="btn-icon bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-all duration-200" 
              title="Previous Page"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div className="text-sm font-medium bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-md text-gray-800 dark:text-gray-200">
              Page <span className="text-indigo-700 dark:text-indigo-400">{pageNumber}</span> of <span className="text-indigo-700 dark:text-indigo-400">{numPages}</span>
            </div>
            
            <button 
              onClick={nextPage} 
              disabled={pageNumber >= numPages}
              className="btn-icon bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-all duration-200" 
              title="Next Page"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={zoomOut}
              className="btn-icon bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-all duration-200"
              title="Zoom Out"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            
            <div className="text-sm font-medium bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-md min-w-[60px] text-center text-gray-800 dark:text-gray-200">
              {Math.round(scale * 100)}%
            </div>
            
            <button
              onClick={zoomIn}
              className="btn-icon bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-all duration-200"
              title="Zoom In"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            
            <button
              onClick={resetZoom}
              className="btn-icon bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-all duration-200"
              title="Reset Zoom"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
          
          <div className="flex items-center">
            <button
              onClick={toggleFullScreen}
              className="btn-icon bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-all duration-200"
              title={isFullScreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            >
              {isFullScreen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                </svg>
              )}
            </button>
            
            <div className="border-l border-gray-300 dark:border-gray-600 h-6 mx-2"></div>
            
            <div className="dropdown relative">
              <button 
                className="btn-secondary text-sm flex items-center gap-1 bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white py-2 px-4 rounded-md transition-all duration-200" 
                title="More Options"
                onClick={toggleDropdown}
              >
                <span>Tools</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50 border border-gray-200 dark:border-gray-700 py-1">
                  <button 
                    onClick={() => {
                      navigate('/summary');
                      setDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                      </svg>
                      Generate Summary
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => {
                      navigate('/chat');
                      setDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                      Chat with PDF
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => {
                      navigate('/mindmap');
                      setDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Create Mind Map
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => {
                      navigate('/simplify');
                      setDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Simplify Content
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Document Info */}
      <div className="card shadow-md rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 md:col-span-1">
        <div className="card-header bg-gradient-to-r from-indigo-700 to-indigo-600 text-white p-4">
          <h2 className="text-xl font-bold">Document Information</h2>
        </div>
        <div className="card-body divide-y divide-gray-200 dark:divide-gray-700 p-0">
          <div className="py-4 px-6 flex justify-between items-center">
            <span className="font-medium text-gray-600 dark:text-gray-400">Filename</span>
            <span className="text-gray-900 dark:text-gray-200 font-medium">{pdfData.title || pdfData.filename}</span>
          </div>
          <div className="py-4 px-6 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
            <span className="font-medium text-gray-600 dark:text-gray-400">Pages</span>
            <span className="text-gray-900 dark:text-gray-200 font-medium">{numPages || "Loading..."}</span>
          </div>
          <div className="py-4 px-6 flex justify-between items-center">
            <span className="font-medium text-gray-600 dark:text-gray-400">Current Page</span>
            <span className="text-gray-900 dark:text-gray-200 font-medium">{pageNumber} of {numPages || "?"}</span>
          </div>
        </div>
        <div className="card-footer bg-gray-50 dark:bg-gray-800/50 p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
            <svg className="w-5 h-5 mr-2 text-indigo-500 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Use the keyboard arrows to navigate pages: ← →, and +/- to zoom
          </div>
        </div>
      </div>
    </div>
  );
};

const AnalysisButton = ({ icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-center justify-center p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
  >
    <div className="mb-1">
      {icon}
    </div>
    <span className="text-xs font-medium text-gray-700">{label}</span>
  </button>
);

export default PDFViewer;

// Add this CSS to improve the PDF viewer in dark mode
<style jsx>{`
  .react-pdf__Document {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .react-pdf__Page {
    margin-bottom: 24px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    position: relative;
  }

  .react-pdf__Page__canvas {
    height: auto !important;
    max-width: 100%;
    object-fit: contain;
  }

  /* Add canvas inversion for dark mode */
  .dark .react-pdf__Page__canvas {
    filter: invert(0.9) hue-rotate(180deg);
    background-color: rgba(255, 255, 255, 0.95);
  }

  .react-pdf__Page__textContent {
    user-select: text;
  }

  .react-pdf__Page__annotations {
    display: none;
  }
`}</style> 