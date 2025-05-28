import axios, { AxiosInstance, AxiosError } from 'axios';

export const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // Add request interceptor to add auth token
  client.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Add response interceptor for error handling
  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        // Clear token and redirect to login if unauthorized
        localStorage.removeItem('token');
        window.location.href = '/auth';
      }
      return Promise.reject(error);
    }
  );

  return client;
};

// Create a singleton instance
export const api = createApiClient();
