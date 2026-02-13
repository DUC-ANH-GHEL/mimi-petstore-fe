import axios from 'axios';
import { API_BASE_URL } from '../config/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');

  if (token) {
    config.headers = config.headers ?? {};
    if (!('Authorization' in config.headers)) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});
