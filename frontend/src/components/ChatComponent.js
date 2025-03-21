import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Spinner from './Spinner';

function ChatComponent({ pdfData }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  
  // Scroll to bottom of chat messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Add welcome message when component mounts
  useEffect(() => {
    setMessages([
      {
        role: 'assistant',
        content: 'Hello! I\'m your AI assistant. How can I help you understand this document?'
      }
    ]);
  }, []);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    const userMessage = {
      role: 'user',
      content: input
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    
    try {
      const response = await axios.post('/chat', {
        message: input.trim(),
        filename: pdfData.filename,
        extract_method: "hybrid"
      });
      
      const assistantMessage = {
        role: 'assistant',
        content: response.data.response
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.'
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };
  
  const generateMindMap = async () => {
    try {
      navigate('/mindmap');
    } catch (error) {
      console.error('Error generating mind map:', error);
    }
  };
  
  const simplifyText = async () => {
    try {
      setLoading(true);
      
      const response = await axios.post('/simplify', { 
        filename: pdfData.filename,
        extract_method: "hybrid" 
      });
      
      const simplifiedMessage = {
        role: 'assistant',
        content: response.data.simplified
      };
      
      setMessages(prev => [...prev, simplifiedMessage]);
    } catch (error) {
      console.error('Error simplifying text:', error);
      
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error simplifying the text. Please try again.'
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };
  
  const summarizeText = async () => {
    try {
      setLoading(true);
      
      const response = await axios.post('/summarize', { 
        filename: pdfData.filename,
        extract_method: "hybrid"
      });
      
      const summaryMessage = {
        role: 'assistant',
        content: response.data.summary
      };
      
      setMessages(prev => [...prev, summaryMessage]);
    } catch (error) {
      console.error('Error summarizing text:', error);
      
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error summarizing the text. Please try again.'
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="chat-container bg-white rounded-lg shadow-md p-4 max-w-4xl mx-auto scale-in">
      <div className="chat-header bg-gradient-to-r from-indigo-600 to-indigo-500 text-white p-4 rounded-t-lg">
        <h2 className="text-xl font-bold">Chat with your Document</h2>
      </div>
      
      <div className="chat-messages h-96 overflow-y-auto p-4 bg-gray-50 rounded-md my-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message p-3 rounded-lg mb-3 max-w-3/4 ${
              message.role === 'user' 
                ? 'user-message bg-indigo-100 ml-auto' 
                : 'assistant-message bg-white shadow-sm border border-gray-200'
            }`}
          >
            <div className="message-content text-gray-800">
              {message.content}
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="message assistant-message bg-white p-3 rounded-lg shadow-sm border border-gray-200 mb-3">
            <div className="message-content loading flex justify-center">
              <Spinner size="small" />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="chat-actions flex flex-wrap gap-2 mb-4">
        <button
          onClick={summarizeText}
          className="action-button bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          disabled={loading}
        >
          Summarize
        </button>
        
        <button
          onClick={simplifyText}
          className="action-button bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          disabled={loading}
        >
          Simplify
        </button>
        
        <button
          onClick={generateMindMap}
          className="action-button bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          disabled={loading}
        >
          Generate Mind Map
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="chat-input flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about your document..."
          disabled={loading}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="send-button bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </form>
    </div>
  );
}

export default ChatComponent; 