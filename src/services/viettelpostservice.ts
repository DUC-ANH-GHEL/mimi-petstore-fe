// 📁 src/services/viettelService.ts
import axios from 'axios';

const VIETTEL_API_URL = 'https://partner.viettelpost.vn/v2';

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