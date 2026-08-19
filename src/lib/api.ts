import { useMemo } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

export function useApi() {
  const { token } = useAuth();

  return useMemo(() => {
    return axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token || ''
      }
    });
  }, [token]);
}

export default api;
