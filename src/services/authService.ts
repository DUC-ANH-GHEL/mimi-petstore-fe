import axios from 'axios';
import { API_BASE_URL } from '../config/api';

export const loginWithApi = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {  
        email: email,
        password: password, },);
    const token = response.data?.access_token;
    if (!token) throw new Error('Không nhận được token');
    return { success: true, token };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || 'Đăng nhập không thành công',
    };
  }
};


export const logout = () => {
    localStorage.removeItem('adminToken');
    sessionStorage.removeItem('adminToken');
  };
  
  export const getToken = () =>
    localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
  