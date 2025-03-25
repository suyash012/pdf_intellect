import axios from 'axios';

// Create a base axios instance with the backend URL
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
});

export default apiClient;