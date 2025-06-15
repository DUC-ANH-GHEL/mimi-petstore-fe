// src/services/productService.ts
import { ProductFormData, ProductFormDataUpdate } from '../types/product';
import { API_BASE_URL } from '../config/api';

import axios from 'axios';
import { json } from 'react-router-dom';

export const // Hàm gọi API tạo sản phẩm mới
createProduct = async (productData: ProductFormData): Promise<any> => {
try {
    // Tạo FormData để upload file và dữ liệu
    const formData = new FormData();
    
    // Thêm các trường thông tin vào formData
    formData.append('name', productData.name);
    formData.append('description', productData.description);
    formData.append('sku', productData.sku);
    formData.append('price', productData.price.toString());
    formData.append('affiliate', productData.affiliate.toString());
    formData.append('weight', productData.weight.toString());
    formData.append('length', productData.length.toString());
    formData.append('width',productData.width.toString());
    formData.append('height', productData.height.toString());
    formData.append('stock', productData.stock.toString());
    formData.append('status', productData.status);
    formData.append('category_id', productData.category_id.toString());
    formData.append('labels', JSON.stringify(productData.labels));
    formData.append('specs', JSON.stringify(productData.specs));
    formData.append('slug', productData.slug);
    formData.append('metaTitle', productData.metaTitle);
    formData.append('metaDescription', productData.metaDescription);
    
    // Thêm các file ảnh vào formData
    productData.images.forEach((image, index) => {
    formData.append(`images`, image);
    });
    
    // Gọi API
    const response = await fetch(`${API_BASE_URL}/products/add-product`, {
    method: 'POST',
    body: formData,
    // Không cần set Content-Type header khi sử dụng FormData
    });
    
    if (!response.ok) {
    throw new Error('Failed to create product');
    }
    
    return await response.json();
} catch (error) {
    console.error('Error creating product:', error);
    throw error;
}
};

export const updateProduct = async (productUpdate: ProductFormDataUpdate) : Promise<any> => {
  try{
    const formData = new FormData();
    if(productUpdate.id != undefined){
      formData.append('id', productUpdate.id.toString());
    }
    formData.append('name', productUpdate.name);
    formData.append('description',  productUpdate.description);
    formData.append('sku', productUpdate.sku);
    formData.append('price', productUpdate.price.toString());
    formData.append('affiliate', productUpdate.affiliate.toString());
    formData.append('weight', productUpdate.weight.toString());
    formData.append('length', productUpdate.length.toString());
    formData.append('width', productUpdate.width.toString());
    formData.append('height', productUpdate.height.toString());
    if(productUpdate.stock != undefined){
      formData.append('stock', productUpdate.stock.toString());
    }
    formData.append('status', productUpdate.status);
    formData.append('category_id', productUpdate.category_id.toString());
    formData.append('labels', JSON.stringify(productUpdate.labels));
    formData.append('specs', JSON.stringify(productUpdate.specs));
    formData.append('slug', productUpdate.slug);
    formData.append('metaTitle', productUpdate.metaTitle);
    formData.append('metaDescription', productUpdate.metaDescription);

    productUpdate.images.forEach(element => {
      formData.append('images', element);
    });
    productUpdate.listImageCurrent.forEach(image => {
      formData.append('listImageCurrent', image);
    })

    const response = await fetch(`${API_BASE_URL}/products/update`, {
      method: 'PUT',
      body: formData
    })

    if(!response.ok){
      throw new Error('Fail to update product')
    }

    return await response.json()
  }
  catch(error){
    throw error;
  }
};

export const getProducts = async (params: {
    search?: string;
    status?: boolean;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products/`, {
        params,
      });
      return response.data;
    } catch (error: any) {
      throw error?.response?.data || { message: 'Lỗi không xác định' };
    }
  };

  export const  getProductById = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  };

  export const getProductImageByProductId = async (productId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products/images/${productId}`);
      return response.data;
    } catch (error) {
      console.log(`Error fetching product image:`,  error)
      throw error
    }
  };

export const productService = {

   
getProducts: async (filters) => {
    try {
      const { search, category, status, page, limit, sortBy, sortOrder } = filters;
      
      const response = await axios.get(`${API_BASE_URL}/products`, {
        params: {
          search,
          status,
          page,
          limit,
          sortBy,
          sortOrder
        }
      });
      
      return {
        data: response.data.products,
        totalCount: response.data.totalCount
      };
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },
  
  /**
   * Get product by ID
   */
  getProductById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  },

  getProductImageByProductId: async (productId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/products/images/${productId}`);
      return response.data;
    } catch (error) {
      console.log(`Error fetching product image:`,  error)
      throw error
    }
  },
  
  /**
   * Create a new product
   */
  createProduct: async (productData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/products`, productData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },
  
  /**
   * Update an existing product
   */
  updateProduct: async (id, productData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/products/${id}`, productData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Delete a product
   */
  deleteProduct: async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/products/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Delete multiple products
   */
  deleteMultiple: async (ids) => {
    try {
      await axios.post(`${API_BASE_URL}/api/products/delete-multiple`, { ids });
      return true;
    } catch (error) {
      console.error('Error deleting multiple products:', error);
      throw error;
    }
  },
  
  /**
   * Get all product categories
   */
  getCategories: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories`);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }
};