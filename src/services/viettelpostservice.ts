// 📁 src/services/viettelService.ts
import axios from 'axios';
import { OrderPayload, ShippingServiceInput } from '../types/order'
import { API_BASE_URL } from '../config/api';

const VIETTEL_API_URL = 'https://partner.viettelpost.vn/v2';

// export const createOrder = async (payload: {
//     items: { product_id: number; quantity: number }[];
//     payment_method: string;
//     note: string;
//     receiver_name: string;
//     receiver_phone: string;
//     receiver_address: string;
//     receiver_province_id: number;
//     receiver_district_id: number;
//     receiver_ward_id: number;
//   }) => {
//     try {
//       const response = await axios.post(`${VIETTEL_API_URL}/order`, payload);
//       return response.data;
//     } catch (error: any) {
//       throw error?.response?.data || { message: 'Lỗi tạo đơn hàng' };
//     }
//   };

export const createOrder = async (payload: OrderPayload) => {
    try {
      const token = sessionStorage.getItem('adminToken');
      const response = await axios.post(`${API_BASE_URL}/order`, payload,  {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error: any) {
      throw error?.response?.data || { message: 'Lỗi tạo đơn hàng' };
    }
  };

export const getProvinces = async (params?: Record<string, any>) => {
  try {
    const response = await axios.get(`${VIETTEL_API_URL}/categories/listProvince`, {
      params,
    });
    return response.data;
  } catch (error: any) {
    throw error?.response?.data || { message: 'Lỗi không xác định khi lấy tỉnh/thành' };
  }
};

export const getDistricts = async (provinceId: number) => {
    try {
      const response = await axios.get(`${VIETTEL_API_URL}/categories/listDistrict`, {
        params: { provinceId },
      });
      return response.data;
    } catch (error: any) {
      throw error?.response?.data || { message: 'Lỗi không xác định khi lấy quận/huyện' };
    }
  };

  export const getWards = async (districtId: number) => {
    try {
      const response = await axios.get(`${VIETTEL_API_URL}/categories/listWards`, {
        params: { districtId },
      });
      return response.data;
    } catch (error: any) {
      throw error?.response?.data || { message: 'Lỗi không xác định khi lấy phường/xã' };
    }
  };

  export const loginViettelPost = async (): Promise<string> => {
    const url = `${API_BASE_URL}/viettelpost/viettelpost/token`;
  
    try {
      const res = await axios.get(url); // gọi đến backend nội bộ
  
      if (res.data?.token) {
        return res.data.token;
      } else {
        throw new Error('Không tìm thấy token trong phản hồi');
      }
    } catch (error: any) {
      console.error('Lỗi khi đăng nhập ViettelPost:', error);
      throw new Error('Đăng nhập ViettelPost thất bại');
    }
  };
  
  
export const getShippingServices = async (body: ShippingServiceInput, token: string) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/viettelpost/viettelpost/get-price`, body, {
        headers: {
          'Content-Type': 'application/json',
          'Token': token
        },
      });
      return res.data;
    } catch (error: any) {
      console.error('Lỗi gọi API lấy giá vận chuyển:', error);
      throw error?.response?.data || { message: 'Lỗi không xác định khi gọi API get-price' };
    }
  };