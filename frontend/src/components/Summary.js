import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import apiClient from '../utils/apiclients';

const Summary = ({ pdfData }) => {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');
  const [length, setLength] = useState('medium');
  const [complexity, setComplexity] = useState('standard');
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const generateSummary = async () => {
    try {
      setLoading(true);
      setError('');
      setWarning('');
      
      const response = await apiClient.post('/summarize', {
        filename: pdfData.filename,
        extract_method: "hybrid",
        complexity
      });
      
      // Check for errors or warnings in the response
      if (response.data.status === "error") {
        setError(response.data.summary);
      } else {
        setSummary(response.data.summary);
      }
    } catch (err) {
      console.error('Summary generation error:', err);
      setError(err.response?.data?.detail || 'Failed to generate summary');
      setSummary('');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pdfData?.filename) {
      generateSummary();
    } else {
      navigate('/upload');
    }
  }, [pdfData, navigate]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(summary).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="summary-container scale-in">
      <div className="card mb-4">
        <div className="card-header flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Document Summary</h2>
            <p className="text-sm text-gray-500">AI-generated summary of "{pdfData?.title || pdfData?.filename || 'your document'}"</p>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={copyToClipboard}
              className="btn-icon"
              title="Copy to clipboard"
              disabled={loading || !summary}
            >
              {copied ? (
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
              )}
            </button>
            <button
              onClick={generateSummary}
              className="btn-icon"
              title="Regenerate summary"
              disabled={loading}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3">
          <div className="card">
            <div className="card-body">
              {warning && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm flex items-start">
                  <svg className="w-5 h-5 mr-2 text-yellow-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>{warning}</span>
                </div>
              )}
              
              {loading ? (
                <div className="flex flex-col items-center justify-center py-10">
                  <div className="loading-spinner mb-4"></div>
                  <p className="text-gray-600">Generating summary...</p>
                </div>
              ) : error ? (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start">
                  <svg className="w-5 h-5 mr-2 mt-0.5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-medium">Failed to generate summary</p>
                    <p className="text-sm mt-1">{error}</p>
                    <button 
                      onClick={generateSummary} 
                      className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              ) : (
                <div className="prose max-w-none">
                  {summary && summary.split('\n').map((paragraph, idx) => (
                    <p key={idx} className={idx === 0 ? "first-paragraph font-medium text-gray-800" : ""}>
                      {paragraph.trim() || <br />}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="md:col-span-1">
          <div className="card sticky top-20">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-800">Summary Options</h3>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Length
                  </label>
                  <div className="flex rounded-md shadow-sm">
                    <button
                      onClick={() => setLength('short')}
                      className={`flex-1 px-3 py-2 text-sm font-medium rounded-l-md border ${
                        length === 'short'
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                      disabled={loading}
                    >
                      Short
                    </button>
                    <button
                      onClick={() => setLength('medium')}
                      className={`flex-1 px-3 py-2 text-sm font-medium border-t border-b ${
                        length === 'medium'
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                      disabled={loading}
                    >
                      Medium
                    </button>
                    <button
                      onClick={() => setLength('long')}
                      className={`flex-1 px-3 py-2 text-sm font-medium rounded-r-md border ${
                        length === 'long'
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                      disabled={loading}
                    >
                      Long
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Complexity
                  </label>
                  <div className="space-y-2">
                    <button
                      onClick={() => setComplexity('simplified')}
                      className={`w-full px-3 py-2 text-sm font-medium rounded-md border ${
                        complexity === 'simplified'
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                      disabled={loading}
                      title="Uses plain language and shorter sentences for easier understanding"
                    >
                      <div className="flex items-center justify-between">
                        <span>Simplified</span>
                        {complexity === 'simplified' && (
                          <svg className="h-5 w-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </button>
                    
                    <button
                      onClick={() => setComplexity('standard')}
                      className={`w-full px-3 py-2 text-sm font-medium rounded-md border ${
                        complexity === 'standard'
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                      disabled={loading}
                      title="Balances technical accuracy and readability for general audiences"
                    >
                      <div className="flex items-center justify-between">
                        <span>Standard</span>
                        {complexity === 'standard' && (
                          <svg className="h-5 w-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </button>
                    
                    <button
                      onClick={() => setComplexity('technical')}
                      className={`w-full px-3 py-2 text-sm font-medium rounded-md border ${
                        complexity === 'technical'
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                      disabled={loading}
                      title="Preserves domain-specific terminology and maintains original complexity"
                    >
                      <div className="flex items-center justify-between">
                        <span>Technical</span>
                        {complexity === 'technical' && (
                          <svg className="h-5 w-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </button>
                  </div>
                </div>
                
                <button
                  onClick={generateSummary}
                  className="btn btn-primary w-full"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      <span>Generating...</span>
                    </div>
                  ) : (
                    'Generate Summary'
                  )}
                </button>
              </div>
            </div>
            <div className="card-footer">
              <button 
                className="btn btn-secondary w-full text-sm"
                onClick={() => navigate('/view')}
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Document
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-500">
        <div className="card fade-in">
          <div className="card-body">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">About This Summary</h3>
            <p>This summary was generated using AI. You can adjust the length and complexity to get different versions.</p>
            
            {complexity === 'technical' && (
              <div className="mt-2 p-3 bg-blue-50 border border-blue-100 rounded-md text-blue-700 text-sm">
                <div className="flex">
                  <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <div>
                    <span className="font-medium">Technical Mode:</span> Preserves domain-specific terminology and maintains the original complexity level.
                  </div>
                </div>
              </div>
            )}
            
            {complexity === 'simplified' && (
              <div className="mt-2 p-3 bg-green-50 border border-green-100 rounded-md text-green-700 text-sm">
                <div className="flex">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <span className="font-medium">Simplified Mode:</span> Uses plain language, shorter sentences, and clear explanations for easier understanding.
                  </div>
                </div>
              </div>
            )}
            
            {complexity === 'standard' && (
              <div className="mt-2 p-3 bg-purple-50 border border-purple-100 rounded-md text-purple-700 text-sm">
                <div className="flex">
                  <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                  </svg>
                  <div>
                    <span className="font-medium">Standard Mode:</span> Balances technical accuracy and readability for a general audience.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary; 