import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import apiClient from '../utils/apiclients';

const Simplify = ({ pdfData }) => {
  const [simplifiedText, setSimplifiedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [customText, setCustomText] = useState("");
  const [useCustomText, setUseCustomText] = useState(false);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const simplifyContent = async () => {
    try {
      setLoading(true);
      setError('');
      
      const requestData = {
        filename: pdfData?.filename || "",
        text: useCustomText ? customText : "",
        extract_method: "hybrid"
      };
      
      const response = await apiClient.post('/simplify', requestData);
      
      if (response.data.status === "success") {
        setSimplifiedText(response.data.simplified);
      } else {
        setError(response.data.simplified || "Error simplifying text");
      }
    } catch (err) {
      console.error('Text simplification error:', err);
      setError(err.response?.data?.error || 'Failed to simplify text');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!pdfData || !pdfData.filename) {
      navigate('/upload');
      return;
    }
    
    if (!useCustomText) {
      simplifyContent();
    }
  }, [pdfData, useCustomText, navigate]);
  
  const copyToClipboard = () => {
    if (simplifiedText) {
      navigator.clipboard.writeText(simplifiedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-indigo-800 dark:text-indigo-300">Simplified Text</h2>
                <p className="text-sm text-indigo-600 dark:text-indigo-400">Convert complex language to plain text from "{pdfData?.title || pdfData?.filename || 'your document'}"</p>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={copyToClipboard}
                  disabled={!simplifiedText || loading}
                  className="btn-icon bg-white dark:bg-gray-700 hover:bg-indigo-50 dark:hover:bg-gray-600 text-indigo-600 dark:text-indigo-400 transition-all duration-200"
                  title="Copy to clipboard"
                >
                  {copied ? (
                    <svg className="w-5 h-5 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-12a2 2 0 00-2-2h-2M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  )}
                </button>
                
                <button
                  onClick={simplifyContent}
                  disabled={loading}
                  className="btn-icon bg-white dark:bg-gray-700 hover:bg-indigo-50 dark:hover:bg-gray-600 text-indigo-600 dark:text-indigo-400 transition-all duration-200"
                  title="Refresh simplified text"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
            </div>
            
            {useCustomText && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Enter text to simplify:</label>
                <textarea
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  rows={6}
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Paste complex text here..."
                />
                <div className="mt-2 flex justify-end">
                  <button
                    onClick={simplifyContent}
                    disabled={!customText.trim() || loading}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center"
                  >
                    {loading ? (
                      <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : null}
                    Simplify Text
                  </button>
                </div>
              </div>
            )}
            
            <div className="mt-8">
              {loading && (
                <div className="text-center py-12">
                  <p className="text-indigo-600 dark:text-indigo-400 animate-pulse">Simplifying your text...</p>
                </div>
              )}
              
              {error && (
                <div className="bg-red-50 dark:bg-red-900 p-4 rounded-lg text-red-700 dark:text-red-200 mb-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{error}</span>
                  </div>
                </div>
              )}
              
              {!loading && !error && simplifiedText ? (
                <div className="simplified-content prose dark:prose-invert max-w-none font-medium text-gray-800 dark:text-gray-200 leading-relaxed tracking-wide">
                  {simplifiedText.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4">{paragraph.trim() || <br/>}</p>
                  ))}
                </div>
              ) : !loading && !error ? (
                <div className="text-center p-12 text-gray-500 dark:text-gray-400">No simplified text available.</div>
              ) : null}
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="card-header bg-gradient-to-r from-indigo-700 to-blue-700 text-white p-4">
              <h3 className="text-lg font-semibold">Options</h3>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={useCustomText}
                    onChange={(e) => setUseCustomText(e.target.checked)}
                    className="form-checkbox h-5 w-5 text-indigo-600 rounded"
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300 font-medium">Use custom text</span>
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-7">
                  Enable this to paste and simplify your own text instead of using the document content.
                </p>
              </div>
              
              <div className="border-t dark:border-gray-700 pt-4">
                <h4 className="text-sm font-semibold text-indigo-700 dark:text-indigo-400 mb-2">About Simplification</h4>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 leading-relaxed">
                  The text simplification process makes complex text easier to understand by:
                </p>
                <ul className="text-sm text-gray-700 dark:text-gray-300 mt-2 space-y-1 list-disc pl-5">
                  <li>Replacing complex words with simpler alternatives</li>
                  <li>Breaking down long sentences into shorter ones</li>
                  <li>Clarifying technical concepts with plain language</li>
                  <li>Maintaining the original meaning while improving readability</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Simplify; 