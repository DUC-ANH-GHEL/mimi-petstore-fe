// src/services/productService.ts
import { ProductFormData } from '../types/product';

// Hàm gọi API tạo sản phẩm mới
export const createProduct = async (productData: ProductFormData): Promise<any> => {
  try {
    // Tạo FormData để upload file và dữ liệu
    const formData = new FormData();
    
    // Thêm các trường thông tin vào formData
    formData.append('name', productData.name);
    formData.append('description', productData.description);
    formData.append('sku', productData.sku);
    formData.append('price', productData.price.toString());
    formData.append('stock', productData.stock.toString());
    formData.append('status', productData.status);
    formData.append('category', productData.category);
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
    const response = await fetch('/api/products', {
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

// Các hàm API khác có thể thêm ở đây: getProducts, updateProduct, deleteProduct, etc.