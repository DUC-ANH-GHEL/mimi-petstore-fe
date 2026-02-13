// src/services/productService.ts
import { ProductFormData, ProductFormDataUpdate } from '../types/product';
import { apiClient } from './apiClient';

type GetProductsParams = {
  search?: string;
  status?: boolean | string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
};

const getSkipLimit = (page?: number, limit?: number) => {
  const safeLimit = typeof limit === 'number' && limit > 0 ? limit : undefined;
  const safePage = typeof page === 'number' && page > 0 ? page : undefined;
  const skip = safePage && safeLimit ? (safePage - 1) * safeLimit : 0;
  return { skip, limit: safeLimit };
};

const isTruthyStatus = (status: unknown) => {
  if (typeof status === 'boolean') return status;
  if (typeof status === 'string') return status.toLowerCase() === 'true' || status.toLowerCase() === 'active';
  return undefined;
};

export const // Hàm gọi API tạo sản phẩm mới
createProduct = async (productData: ProductFormData): Promise<any> => {
  try {
    const formData = new FormData();

    // OpenAPI: POST /api/v1/products/ (multipart/form-data)
    formData.append('name', productData.name);
    formData.append('slug', productData.slug);
    // Keep payload aligned with OpenAPI schema: include optional fields when present
    // (backend may still accept omission, but some validators expect the key)
    formData.append('description', (productData.description ?? '').toString());
    formData.append('price', productData.price.toString());
    formData.append('sku', productData.sku);
    formData.append('affiliate', String(productData.affiliate ?? 0));
    formData.append('weight', productData.weight.toString());
    formData.append('length', productData.length.toString());
    formData.append('width', productData.width.toString());
    formData.append('height', productData.height.toString());
    formData.append('is_active', String(productData.is_active ?? true));
    formData.append('category_id', productData.category_id.toString());

    // Only append File images if present (UI types currently store image URLs as strings)
    (productData.images ?? []).forEach((img: any) => {
      if (img instanceof File) {
        formData.append('images', img);
      }
    });

    const response = await apiClient.post(`/products/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

export const updateProduct = async (productUpdate: ProductFormDataUpdate) : Promise<any> => {
  try {
    // OpenAPI: PUT /api/v1/products/{product_id} (application/json)
    // Note: image updates are handled separately via /products/{product_id}/images endpoints.
    const body = {
      id: productUpdate.id,
      name: productUpdate.name,
      slug: productUpdate.slug,
      description: productUpdate.description ?? null,
      price: Number(productUpdate.price),
      sku: productUpdate.sku,
      affiliate: Number(productUpdate.affiliate ?? 0),
      weight: Number(productUpdate.weight),
      length: Number(productUpdate.length),
      width: Number(productUpdate.width),
      height: Number(productUpdate.height),
      is_active: Boolean(productUpdate.is_active),
      category_id: Number(productUpdate.category_id),

      // Keep compatibility with the backend's ProductUpdate schema
      listImageCurrent: Array.isArray(productUpdate.listImageCurrent) ? productUpdate.listImageCurrent : [],
      listImageNew: [],
      images: [],
    };

    const response = await apiClient.put(`/products/${productUpdate.id}`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateProductStock = async (productId: number, quantity: number) => {
  // OpenAPI: PATCH /api/v1/products/{product_id}/stock?quantity=...
  const response = await apiClient.patch(`/products/${productId}/stock`, undefined, {
    params: { quantity },
  });
  return response.data;
};

export const getProducts = async (params: GetProductsParams) => {
  try {
    const { skip, limit } = getSkipLimit(params?.page, params?.limit);
    const activeOnly = isTruthyStatus(params?.status);
    const search = (params?.search ?? '').trim();

    // OpenAPI supports: skip, limit, in_stock
    // Search/status are handled client-side to keep existing UI behavior.
    const serverLimit = search ? 1000 : (limit ?? 100);
    const response = await apiClient.get(`/products/`, {
      params: {
        skip: search ? 0 : skip,
        limit: serverLimit,
        in_stock: false,
      },
    });

    let list = Array.isArray(response.data) ? response.data : [];

    if (typeof activeOnly === 'boolean') {
      list = list.filter((p: any) => Boolean(p?.is_active) === activeOnly);
    }

    if (search) {
      const q = search.toLowerCase();
      list = list.filter((p: any) => {
        const name = String(p?.name ?? '').toLowerCase();
        const sku = String(p?.sku ?? '').toLowerCase();
        return name.includes(q) || sku.includes(q);
      });
    }

    const effectiveLimit = limit ?? 100;
    const effectiveSkip = search ? (skip ?? 0) : skip;
    const paged = list.slice(effectiveSkip, effectiveSkip + effectiveLimit);

    // Back-compat shape used in existing screens
    const minimumTotal = search ? list.length : effectiveSkip + paged.length + (paged.length === effectiveLimit ? effectiveLimit : 0);
    return {
      data: paged,
      total: minimumTotal,
      totalCount: minimumTotal,
    };
  } catch (error: any) {
    throw error?.response?.data || { message: 'Lỗi không xác định' };
  }
};

  export const  getProductById = async (id) => {
    try {
      const response = await apiClient.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  };

  export const getProductImageByProductId = async (productId) => {
    try {
      const response = await apiClient.get(`/products/${productId}/images`);
      return response.data;
    } catch (error) {
      console.log(`Error fetching product image:`,  error)
      throw error
    }
  };

export const productService = {

   
  getProducts: async (filters) => getProducts(filters),
  
  /**
   * Get product by ID
   */
  getProductById: async (id) => {
    try {
      return await getProductById(id);
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  },

  getProductImageByProductId: async (productId) => {
    try {
      return await getProductImageByProductId(productId);
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
      return await createProduct(productData);
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
      const response = await apiClient.put(`/products/${id}`, productData);
      return response.data;
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      throw error;
    }
  },

  updateProductStock: async (productId: number, quantity: number) => updateProductStock(productId, quantity),
  
  /**
   * Delete a product
   */
  deleteProduct: async (id) => {
    try {
      await apiClient.delete(`/products/${id}`);
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
      await Promise.all((ids ?? []).map((id: any) => apiClient.delete(`/products/${id}`)));
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
      const response = await apiClient.get(`/categories/categories/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }
};