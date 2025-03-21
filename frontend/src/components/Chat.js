import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

const Chat = ({ pdfData }) => {
  const [messages, setMessages] = useState([
    { 
      role: 'system', 
      content: 'Hi! I\'m your AI research assistant. Ask me anything about the document you\'ve uploaded!',
      timestamp: new Date().toISOString(),
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showTypingIndicator, setShowTypingIndicator] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(null);
  const messageEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!pdfData || !pdfData.filename) {
      navigate('/upload');
    }
    scrollToBottom();
    
    // Focus input when component loads
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [pdfData, navigate, messages]);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!input.trim() || loading) return;
    
    const userMessage = { 
      role: 'user', 
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    setLoading(true);
    setError(null);
    setShowTypingIndicator(true);
    
    try {
      const response = await axios.post('/chat', {
        message: userMessage.content,
        filename: pdfData.filename,
        extract_method: "hybrid"
      });
      
      setShowTypingIndicator(false);
      
      if (response.data && response.data.response) {
        setMessages(prevMessages => [
          ...prevMessages,
          { 
            role: 'assistant', 
            content: response.data.response,
            timestamp: new Date().toISOString(),
          }
        ]);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to get a response. Please try again.');
      setShowTypingIndicator(false);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      { 
        role: 'system', 
        content: 'Hi! I\'m your AI research assistant. Ask me anything about the document you\'ve uploaded!',
        timestamp: new Date().toISOString(),
      }
    ]);
  };

  const handleSuggestedQuestion = (question) => {
    if (loading) return;
    
    const userMessage = {
      role: 'user',
      content: question,
      timestamp: new Date().toISOString(),
    };
    
    setInput(question);
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setLoading(true);
    setError(null);
    setShowTypingIndicator(true);
    
    axios.post('/chat', {
      message: question,
      filename: pdfData.filename,
      extract_method: "hybrid"
    })
    .then(response => {
      setShowTypingIndicator(false);
      
      if (response.data && response.data.response) {
        setMessages(prevMessages => [
          ...prevMessages,
          { 
            role: 'assistant', 
            content: response.data.response,
            timestamp: new Date().toISOString(),
          }
        ]);
      } else {
        throw new Error('Invalid response from server');
      }
    })
    .catch(err => {
      console.error('Error sending message:', err);
      setError('Failed to get a response. Please try again.');
      setShowTypingIndicator(false);
    })
    .finally(() => {
      setLoading(false);
    });
  };
  
  const copyMessageToClipboard = (content, index) => {
    navigator.clipboard.writeText(content).then(() => {
      setCopiedMessage(index);
      setTimeout(() => setCopiedMessage(null), 2000);
    });
  };
  
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border dark:border-gray-700">
          <div className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Chat with Your Document</h2>
                <p className="text-sm text-gray-500 dark:text-gray-300">Ask questions about "{pdfData?.title || 'your document'}"</p>
              </div>
              <button 
                onClick={clearChat}
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-medium focus:outline-none flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear chat
              </button>
            </div>
            
            {/* Chat messages */}
            <div ref={chatContainerRef} className="mt-6 space-y-4 h-[400px] overflow-y-auto chat-container p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border dark:border-gray-600 shadow-inner">
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[85%] rounded-lg p-4 ${
                      message.role === 'user' 
                        ? 'bg-indigo-100 dark:bg-indigo-900 text-gray-800 dark:text-gray-100 rounded-tr-none' 
                        : 'bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-100 shadow-sm rounded-tl-none'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      {message.role === 'system' && (
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                          <span className="ml-2 font-medium text-indigo-700 dark:text-indigo-300">AI Assistant</span>
                        </div>
                      )}
                      {message.role === 'assistant' && (
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                          <span className="ml-2 font-medium text-emerald-700 dark:text-emerald-300">AI Assistant</span>
                        </div>
                      )}
                      {message.role === 'user' && (
                        <div className="flex items-center">
                          <span className="font-medium text-indigo-700 dark:text-indigo-300">You</span>
                        </div>
                      )}
                      
                      <div className="flex items-center ml-2 text-xs text-gray-500 dark:text-gray-400">
                        {message.timestamp && formatTimestamp(message.timestamp)}
                      </div>
                    </div>
                    
                    <div className="prose dark:prose-invert max-w-none">
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                    
                    {(message.role === 'assistant' || message.role === 'system') && (
                      <div className="flex justify-end mt-2">
                        <button
                          onClick={() => copyMessageToClipboard(message.content, index)}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
                          title="Copy to clipboard"
                        >
                          {copiedMessage === index ? (
                            <div className="flex items-center text-emerald-600 dark:text-emerald-400">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <span className="text-xs">Copied!</span>
                            </div>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                            </svg>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {showTypingIndicator && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-gray-600 p-4 rounded-lg rounded-tl-none shadow-sm max-w-[85%]">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 dark:bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 dark:bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 dark:bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messageEndRef} />
            </div>
            
            {/* Input form */}
            <form onSubmit={handleSubmit} className="mt-6">
              {error && (
                <div className="mt-2 p-3 bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{error}</span>
                  </div>
                </div>
              )}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  ref={inputRef}
                  placeholder="Ask a question about your document..."
                  className="flex-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {loading ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <span>Send</span>
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Press Enter to send your message
              </p>
            </form>
            
            {/* Suggested questions */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Suggested Questions</h3>
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                <SuggestedQuestion 
                  question="Can you summarize the key points of this document?" 
                  onClick={() => handleSuggestedQuestion("Can you summarize the key points of this document?")}
                />
                <SuggestedQuestion 
                  question="What are the main conclusions of this document?" 
                  onClick={() => handleSuggestedQuestion("What are the main conclusions of this document?")}
                />
                <SuggestedQuestion 
                  question="Can you explain the most important concepts?" 
                  onClick={() => handleSuggestedQuestion("Can you explain the most important concepts?")}
                />
                <SuggestedQuestion 
                  question="What evidence supports the main arguments?" 
                  onClick={() => handleSuggestedQuestion("What evidence supports the main arguments?")}
                />
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-t border-gray-200 dark:border-gray-600">
            <div className="flex justify-between items-center">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {messages.length > 1 ? `${messages.length - 1} messages` : "No messages yet"}
              </div>
              <button 
                onClick={() => navigate('/view')}
                className="btn btn-secondary text-sm dark:text-gray-200 flex items-center"
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
    </div>
  );
};

const SuggestedQuestion = ({ question, onClick }) => (
  <button
    onClick={onClick}
    className="w-full text-left p-3 rounded-lg text-sm border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors dark:text-gray-200 hover:shadow-sm"
  >
    {question}
  </button>
);

export default Chat; 