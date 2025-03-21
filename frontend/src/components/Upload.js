import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import supabase from '../utils/supabaseClient';

const Upload = ({ onPdfUpload, existingPdfData }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf') {
        setFile(droppedFile);
        setError('');
      } else {
        setError('Please select a PDF file');
      }
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        setError('');
      } else {
        setFile(null);
        setError('Please select a PDF file');
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    if (!user) {
      setError('You must be logged in to upload files');
      return;
    }

    setUploading(true);
    setError('');
    
    try {
      // First, upload the file to Supabase Storage
      const filePath = `${user.id}/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
      
      // Upload file to storage
      const { data: storageData, error: storageError } = await supabase.storage
        .from('pdfs')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          onUploadProgress: (progress) => {
            const percentCompleted = Math.round((progress.loaded * 100) / progress.total);
            setUploadProgress(percentCompleted);
          }
        });
      
      if (storageError) throw storageError;
      
      // Create a record in the pdfs table
      const { data: pdfData, error: dbError } = await supabase
        .from('pdfs')
        .insert([
          {
            title: title || file.name,
            filename: file.name,
            file_path: filePath,
            file_size: file.size,
            content_type: file.type,
            user_id: user.id
          }
        ])
        .select()
        .single();
      
      if (dbError) throw dbError;
      
      // Create a publicly accessible URL (will still be protected by RLS)
      const { data: publicUrlData } = await supabase.storage
        .from('pdfs')
        .getPublicUrl(filePath);
      
      // Store the PDF data for global access
      const pdf = {
        id: pdfData.id,
        filename: pdfData.filename,
        title: pdfData.title,
        url: publicUrlData.publicUrl
      };
      
      // Call the callback to update parent state
      if (onPdfUpload) {
        onPdfUpload(pdf);
      }
      
      // Navigate to PDF viewer
      navigate(`/pdf/${pdfData.id}`);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Error uploading file');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 scale-in">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-700 to-indigo-600 p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">Upload PDF</h1>
          <p className="text-indigo-100">
            Upload your PDF document for analysis and visualization
          </p>
        </div>
        
        <div className="p-6">
          {error && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-lg border border-red-200 dark:border-red-800/50 flex items-start">
              <svg className="w-5 h-5 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}
          
          <div className="mb-6">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Document Title (Optional)
            </label>
            <input
              type="text"
              id="title"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 dark:bg-gray-700 dark:text-white transition-all"
              placeholder="Enter a title for your document"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div 
            className={`mb-6 border-2 border-dashed rounded-lg p-8 text-center 
              ${dragActive ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 dark:border-indigo-400' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'} 
              ${file ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-300 dark:border-indigo-600' : ''} 
              transition-all duration-200`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center">
              {file ? (
                <>
                  <div className="w-16 h-16 mb-4 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-indigo-700 dark:text-indigo-400 font-medium mb-1">{file.name}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 font-medium mb-1">Drag & Drop your PDF here</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">or click to browse</p>
                  <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-indigo-500 dark:border-indigo-400 rounded-md bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-600 transition-colors">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    <span>Browse Files</span>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf"
                      onChange={handleFileChange}
                    />
                  </label>
                </>
              )}
            </div>
          </div>
          
          {uploading && (
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-300 font-medium">Uploading...</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-medium">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div 
                  className="bg-indigo-600 dark:bg-indigo-500 h-2.5 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}
          
          <div className="flex justify-end">
            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className={`px-6 py-2.5 rounded-lg font-medium text-white
                ${!file || uploading 
                  ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed' 
                  : 'bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 transform transition-all hover:scale-105'}
                shadow-md`}
            >
              {uploading ? 'Uploading...' : 'Upload PDF'}
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-10 border-t pt-6 border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Features</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { name: 'Summary Generation', desc: 'Get concise summaries of your document' },
            { name: 'Interactive Mind Maps', desc: 'Visualize document structure and concepts' },
            { name: 'AI-powered Chat', desc: 'Ask questions about your document' },
            { name: 'Text Simplification', desc: 'Convert complex text to easy-to-read language' }
          ].map((feature, index) => (
            <div key={index} className="feature-item p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-start">
                <div className="feature-icon mr-3 p-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30">
                  <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-gray-200">{feature.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{feature.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Upload; 