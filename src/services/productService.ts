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

export type AdminProductStatus = 'active' | 'draft' | 'discontinued';
export type StockStatus = 'in_stock' | 'low' | 'out';

export type AdminProductsQuery = {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'all' | AdminProductStatus;
  category_id?: number | string;
  brand?: string;
  has_variants?: boolean | 'all';
  stock_status?: StockStatus | 'all';
  min_price?: number | string;
  max_price?: number | string;
  has_affiliate?: boolean | 'all';
  featured?: boolean | 'all';
  sort?:
    | 'name_asc'
    | 'name_desc'
    | 'price_asc'
    | 'price_desc'
    | 'stock_asc'
    | 'stock_desc'
    | 'created_asc'
    | 'created_desc'
    | 'updated_asc'
    | 'updated_desc';
};

export type AdminProductListItem = {
  id: number;
  name: string;
  sku?: string | null;
  slug?: string | null;
  thumbnail?: string | null;
  price_min?: number | null;
  price_max?: number | null;
  stock_total?: number | null;
  variant_count?: number | null;
  profit_min?: number | null;
  margin_percent?: number | null;
  status?: AdminProductStatus | null;
  is_active?: boolean | null;
  category?: string | null;
  category_id?: number | null;
  brand?: string | null;
  affiliate?: number | null;
  featured?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type AdminProductsResponse = {
  data: AdminProductListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
};

const getProductThumb = (product: any): string | undefined => {
  if (!product) return undefined;

  const direct = product.thumbnail || product.image || product.image_url || product.imageUrl;
  if (typeof direct === 'string' && direct.trim()) return direct;

  const images = product.images;
  if (Array.isArray(images) && images.length > 0) {
    const first = images[0];
    if (typeof first === 'string' && first.trim()) return first;
    if (first && typeof first === 'object') {
      const url = (first as any).image_url || (first as any).url;
      if (typeof url === 'string' && url.trim()) return url;
    }
  }

  return undefined;
};

const toNumberOrUndefined = (v: any) => {
  if (v === null || v === undefined || v === '') return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
};

const mapProductToAdminListItemFallback = (p: any): AdminProductListItem => {
  const variants: any[] = Array.isArray(p?.variants) ? p.variants : [];
  const variant_count =
    typeof p?.variant_count === 'number' ? p.variant_count : variants.length > 0 ? variants.length : 0;

  const prices = variants
    .map((v) => Number(v?.price))
    .filter((x) => Number.isFinite(x) && x > 0);
  const price_min = prices.length > 0 ? Math.min(...prices) : toNumberOrUndefined(p?.price) ?? null;
  const price_max = prices.length > 0 ? Math.max(...prices) : toNumberOrUndefined(p?.price) ?? null;

  const stocks = variants
    .map((v) => Number(v?.stock))
    .filter((x) => Number.isFinite(x));
  const stock_total = stocks.length > 0 ? stocks.reduce((s, x) => s + x, 0) : toNumberOrUndefined(p?.stock) ?? null;

  const cost = toNumberOrUndefined(p?.cost_price) ?? toNumberOrUndefined(p?.cost) ?? undefined;
  const profit_min = cost !== undefined && price_min !== null ? Math.max(0, price_min - cost) : null;
  const margin_percent =
    profit_min !== null && price_min !== null && price_min > 0 ? Math.round((profit_min / price_min) * 100) : null;

  const status: AdminProductStatus =
    typeof p?.status === 'string'
      ? (p.status as AdminProductStatus)
      : Boolean(p?.is_active)
        ? 'active'
        : 'draft';

  return {
    id: Number(p?.id),
    name: String(p?.name ?? ''),
    sku: p?.sku ?? null,
    slug: p?.slug ?? null,
    thumbnail: getProductThumb(p) ?? null,
    price_min,
    price_max,
    stock_total,
    variant_count,
    profit_min,
    margin_percent,
    status,
    is_active: p?.is_active ?? null,
    category: p?.category?.name ?? p?.category ?? null,
    category_id: typeof p?.category_id === 'number' ? p.category_id : toNumberOrUndefined(p?.category_id) ?? null,
    brand: p?.brand ?? null,
    affiliate: toNumberOrUndefined(p?.affiliate) ?? null,
    featured: Boolean(p?.featured ?? false),
    created_at: p?.created_at ?? p?.createdAt ?? null,
    updated_at: p?.updated_at ?? p?.updatedAt ?? null,
  };
};

export const getAdminProducts = async (query: AdminProductsQuery): Promise<AdminProductsResponse> => {
  const page = typeof query?.page === 'number' && query.page > 0 ? query.page : 1;
  const limit = typeof query?.limit === 'number' && query.limit > 0 ? query.limit : 20;

  try {
    const response = await apiClient.get('/admin/products', {
      params: {
        page,
        limit,
        search: query?.search ?? undefined,
        status: query?.status && query.status !== 'all' ? query.status : undefined,
        category_id: query?.category_id ?? undefined,
        brand: query?.brand ?? undefined,
        has_variants:
          typeof query?.has_variants === 'boolean' ? String(query.has_variants) : undefined,
        stock_status: query?.stock_status && query.stock_status !== 'all' ? query.stock_status : undefined,
        min_price: query?.min_price ?? undefined,
        max_price: query?.max_price ?? undefined,
        has_affiliate:
          typeof query?.has_affiliate === 'boolean' ? String(query.has_affiliate) : undefined,
        featured: typeof query?.featured === 'boolean' ? String(query.featured) : undefined,
        sort: query?.sort ?? undefined,
      },
    });

    const data = Array.isArray(response?.data?.data) ? response.data.data : Array.isArray(response?.data) ? response.data : [];
    const pagination = response?.data?.pagination;
    return {
      data,
      pagination: {
        page: Number(pagination?.page ?? page),
        limit: Number(pagination?.limit ?? limit),
        total: Number(pagination?.total ?? (response?.data?.total ?? data.length ?? 0)),
      },
    };
  } catch (error: any) {
    // Fallback to existing public list endpoint when admin endpoint isn't available yet.
    if (error?.response?.status === 404) {
      const response = await apiClient.get(`/products/`, {
        params: {
          skip: 0,
          limit: 1000,
          in_stock: false,
        },
      });

      let list = Array.isArray(response.data) ? response.data : [];

      const search = String(query?.search ?? '').trim();
      if (search) {
        const q = search.toLowerCase();
        list = list.filter((p: any) => {
          const name = String(p?.name ?? '').toLowerCase();
          const sku = String(p?.sku ?? '').toLowerCase();
          const slug = String(p?.slug ?? '').toLowerCase();
          return name.includes(q) || sku.includes(q) || slug.includes(q);
        });
      }

      const status = query?.status;
      if (status && status !== 'all') {
        list = list.filter((p: any) => {
          const mapped = mapProductToAdminListItemFallback(p);
          return mapped.status === status;
        });
      }

      const categoryId = toNumberOrUndefined(query?.category_id);
      if (categoryId !== undefined) {
        list = list.filter((p: any) => toNumberOrUndefined(p?.category_id) === categoryId);
      }

      const brand = String(query?.brand ?? '').trim();
      if (brand) {
        const qb = brand.toLowerCase();
        list = list.filter((p: any) => String(p?.brand ?? '').toLowerCase().includes(qb));
      }

      if (typeof query?.featured === 'boolean') {
        list = list.filter((p: any) => Boolean(p?.featured) === query.featured);
      }

      if (typeof query?.has_affiliate === 'boolean') {
        list = list.filter((p: any) => {
          const a = toNumberOrUndefined(p?.affiliate) ?? 0;
          return query.has_affiliate ? a > 0 : a <= 0;
        });
      }

      if (typeof query?.has_variants === 'boolean') {
        list = list.filter((p: any) => {
          const mapped = mapProductToAdminListItemFallback(p);
          return query.has_variants ? (mapped.variant_count ?? 0) > 0 : (mapped.variant_count ?? 0) === 0;
        });
      }

      const minPrice = toNumberOrUndefined(query?.min_price);
      const maxPrice = toNumberOrUndefined(query?.max_price);
      if (minPrice !== undefined || maxPrice !== undefined) {
        list = list.filter((p: any) => {
          const mapped = mapProductToAdminListItemFallback(p);
          const lo = mapped.price_min ?? 0;
          const hi = mapped.price_max ?? lo;
          if (minPrice !== undefined && hi < minPrice) return false;
          if (maxPrice !== undefined && lo > maxPrice) return false;
          return true;
        });
      }

      const stockStatus = query?.stock_status;
      if (stockStatus && stockStatus !== 'all') {
        list = list.filter((p: any) => {
          const mapped = mapProductToAdminListItemFallback(p);
          const stock = mapped.stock_total ?? 0;
          if (stockStatus === 'in_stock') return stock > 0;
          if (stockStatus === 'low') return stock > 0 && stock < 10;
          if (stockStatus === 'out') return stock <= 0;
          return true;
        });
      }

      const sort = query?.sort ?? 'created_desc';
      const mappedList = list.map(mapProductToAdminListItemFallback);
      const compare = (a: any, b: any) => (a < b ? -1 : a > b ? 1 : 0);
      mappedList.sort((a, b) => {
        switch (sort) {
          case 'name_asc':
            return compare(String(a.name).toLowerCase(), String(b.name).toLowerCase());
          case 'name_desc':
            return compare(String(b.name).toLowerCase(), String(a.name).toLowerCase());
          case 'price_asc':
            return compare(a.price_min ?? 0, b.price_min ?? 0);
          case 'price_desc':
            return compare(b.price_min ?? 0, a.price_min ?? 0);
          case 'stock_asc':
            return compare(a.stock_total ?? 0, b.stock_total ?? 0);
          case 'stock_desc':
            return compare(b.stock_total ?? 0, a.stock_total ?? 0);
          case 'updated_asc':
            return compare(String(a.updated_at ?? ''), String(b.updated_at ?? ''));
          case 'updated_desc':
            return compare(String(b.updated_at ?? ''), String(a.updated_at ?? ''));
          case 'created_asc':
            return compare(String(a.created_at ?? ''), String(b.created_at ?? ''));
          case 'created_desc':
          default:
            return compare(String(b.created_at ?? ''), String(a.created_at ?? ''));
        }
      });

      const total = mappedList.length;
      const start = (page - 1) * limit;
      const data = mappedList.slice(start, start + limit);
      return {
        data,
        pagination: { page, limit, total },
      };
    }

    throw error;
  }
};

export const bulkUpdateProducts = async (payload: {
  ids: number[];
  action: 'status' | 'delete' | 'category' | 'affiliate';
  data: any;
}) => {
  const ids = Array.isArray(payload?.ids) ? payload.ids.map((x) => Number(x)).filter((x) => Number.isFinite(x)) : [];
  if (ids.length === 0) throw new Error('Chưa chọn sản phẩm');

  const response = await apiClient.patch('/admin/products/bulk', {
    ids,
    action: payload.action,
    data: payload.data,
  });
  return response.data;
};

export const updateProductPartial = async (productId: number, patch: any) => {
  const rawPatch = patch && typeof patch === 'object' ? patch : {};

  // If only stock is updated, prefer the dedicated endpoint.
  const patchKeys = Object.keys(rawPatch);
  if (patchKeys.length === 1 && patchKeys[0] === 'stock') {
    const quantity = Number(rawPatch.stock);
    if (Number.isFinite(quantity)) {
      return updateProductStock(productId, quantity);
    }
  }

  // Map PRD status to existing backend field.
  const normalizedStatus = rawPatch.status !== undefined ? String(rawPatch.status).toLowerCase() : undefined;
  const derivedIsActive =
    normalizedStatus === 'active' ? true : normalizedStatus === 'draft' || normalizedStatus === 'discontinued' ? false : undefined;

  // Fetch current product and send a full PUT payload (backend expects many fields).
  const currentRes = await apiClient.get(`/products/${productId}`);
  const current = currentRes?.data ?? {};

  const body: any = {
    name: rawPatch.name !== undefined ? rawPatch.name : current.name,
    slug: rawPatch.slug !== undefined ? rawPatch.slug : current.slug,
    sku: rawPatch.sku !== undefined ? rawPatch.sku : current.sku,
    description:
      rawPatch.description !== undefined
        ? rawPatch.description === null
          ? null
          : String(rawPatch.description)
        : current.description ?? null,
    price: rawPatch.price !== undefined ? Number(rawPatch.price) : Number(current.price ?? 0),
    sale_price:
      rawPatch.sale_price !== undefined
        ? rawPatch.sale_price === null
          ? null
          : Number(rawPatch.sale_price)
        : current.sale_price === null || current.sale_price === undefined
          ? null
          : Number(current.sale_price),
    currency: rawPatch.currency !== undefined ? String(rawPatch.currency) : String(current.currency ?? 'VND'),
    stock: rawPatch.stock !== undefined ? Number(rawPatch.stock) : Number(current.stock ?? 0),
    weight: rawPatch.weight !== undefined ? Number(rawPatch.weight) : Number(current.weight ?? 0),
    length: rawPatch.length !== undefined ? Number(rawPatch.length) : Number(current.length ?? 0),
    width: rawPatch.width !== undefined ? Number(rawPatch.width) : Number(current.width ?? 0),
    height: rawPatch.height !== undefined ? Number(rawPatch.height) : Number(current.height ?? 0),
    category_id: rawPatch.category_id !== undefined ? Number(rawPatch.category_id) : Number(current.category_id ?? current?.category?.id ?? 0),
    is_active:
      rawPatch.is_active !== undefined
        ? Boolean(rawPatch.is_active)
        : derivedIsActive !== undefined
          ? derivedIsActive
          : Boolean(current.is_active),
    affiliate: rawPatch.affiliate !== undefined ? Number(rawPatch.affiliate ?? 0) : Number(current.affiliate ?? 0),
    brand: rawPatch.brand !== undefined ? (rawPatch.brand === null ? null : String(rawPatch.brand)) : current.brand ?? null,
    material:
      rawPatch.material !== undefined ? (rawPatch.material === null ? null : String(rawPatch.material)) : current.material ?? null,
    size: rawPatch.size !== undefined ? (rawPatch.size === null ? null : String(rawPatch.size)) : current.size ?? null,
    color: rawPatch.color !== undefined ? (rawPatch.color === null ? null : String(rawPatch.color)) : current.color ?? null,
    pet_type:
      rawPatch.pet_type !== undefined ? (rawPatch.pet_type === null ? null : String(rawPatch.pet_type)) : current.pet_type ?? null,
    season: rawPatch.season !== undefined ? (rawPatch.season === null ? null : String(rawPatch.season)) : current.season ?? null,
  };

  const response = await apiClient.put(`/products/${productId}`, body);
  return response.data;
};

export const getProductVariants = async (productId: number) => {
  const response = await apiClient.get(`/products/${productId}`);
  const variants = response?.data?.variants;
  return Array.isArray(variants) ? variants : [];
};

export const updateVariantPartial = async (variantId: number, patch: any) => {
  // Expected by PRD (admin endpoint). Backend may not be available yet.
  const response = await apiClient.patch(`/admin/products/variants/${variantId}`, patch);
  return response.data;
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
    const description = (productData.description ?? '').toString();
    if (description.trim().length > 0) {
      formData.append('description', description);
    }
    formData.append('price', productData.price.toString());
    if (productData.sale_price !== null && productData.sale_price !== undefined) {
      formData.append('sale_price', String(productData.sale_price));
    }
    if (productData.currency && String(productData.currency).trim()) {
      formData.append('currency', String(productData.currency).trim());
    }
    formData.append('sku', productData.sku);
    formData.append('affiliate', String(Math.trunc(Number(productData.affiliate ?? 0))));
    if (typeof productData.stock === 'number') {
      formData.append('stock', String(Math.trunc(productData.stock)));
    }
    formData.append('weight', productData.weight.toString());
    formData.append('length', productData.length.toString());
    formData.append('width', productData.width.toString());
    formData.append('height', productData.height.toString());
    formData.append('is_active', String(productData.is_active ?? true));
    formData.append('category_id', productData.category_id.toString());

    if (productData.brand && String(productData.brand).trim()) formData.append('brand', String(productData.brand).trim());
    if (productData.material && String(productData.material).trim()) formData.append('material', String(productData.material).trim());
    if (productData.size && String(productData.size).trim()) formData.append('size', String(productData.size).trim());
    if (productData.color && String(productData.color).trim()) formData.append('color', String(productData.color).trim());
    if (productData.pet_type && String(productData.pet_type).trim()) formData.append('pet_type', String(productData.pet_type).trim());
    if (productData.season && String(productData.season).trim()) formData.append('season', String(productData.season).trim());

    if (productData.variants !== undefined && productData.variants !== null) {
      if (typeof productData.variants === 'string') {
        const variantsText = productData.variants.trim();
        if (variantsText.length > 0) {
          formData.append('variants', variantsText);
        }
      } else if (Array.isArray(productData.variants) && productData.variants.length > 0) {
        formData.append('variants', JSON.stringify(productData.variants));
      }
    }

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
    const body: any = {
      name: productUpdate.name,
      slug: productUpdate.slug,
      sku: productUpdate.sku,
      description: productUpdate.description ? String(productUpdate.description) : null,
      price: Number(productUpdate.price),
      sale_price: productUpdate.sale_price === null || productUpdate.sale_price === undefined ? null : Number(productUpdate.sale_price),
      currency: productUpdate.currency ? String(productUpdate.currency) : 'VND',
      stock: productUpdate.stock === null || productUpdate.stock === undefined ? 0 : Number(productUpdate.stock),
      weight: Number(productUpdate.weight),
      length: Number(productUpdate.length),
      width: Number(productUpdate.width),
      height: Number(productUpdate.height),
      category_id: Number(productUpdate.category_id),
      is_active: Boolean(productUpdate.is_active),
      affiliate: Number(productUpdate.affiliate ?? 0),
      brand: productUpdate.brand ? String(productUpdate.brand) : null,
      material: productUpdate.material ? String(productUpdate.material) : null,
      size: productUpdate.size ? String(productUpdate.size) : null,
      color: productUpdate.color ? String(productUpdate.color) : null,
      pet_type: productUpdate.pet_type ? String(productUpdate.pet_type) : null,
      season: productUpdate.season ? String(productUpdate.season) : null,
    };

    if (productUpdate.variants !== undefined) {
      if (typeof productUpdate.variants === 'string') {
        body.variants = productUpdate.variants;
      } else if (Array.isArray(productUpdate.variants)) {
        body.variants = JSON.stringify(productUpdate.variants);
      }
    }

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

  getAdminProducts: async (query) => getAdminProducts(query),

  bulkUpdateProducts: async (payload) => bulkUpdateProducts(payload),

  updateProductPartial: async (productId: number, patch: any) => updateProductPartial(productId, patch),

  getProductVariants: async (productId: number) => getProductVariants(productId),

  updateVariantPartial: async (variantId: number, patch: any) => updateVariantPartial(variantId, patch),
  
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
      const productId = Number(id);
      if (!Number.isFinite(productId)) {
        throw new Error('ID sản phẩm không hợp lệ');
      }
      await apiClient.delete(`/products/${productId}`);
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
      const list = Array.isArray(ids) ? ids : [];
      const normalized = list
        .map((x: any) => Number(x))
        .filter((x: any) => Number.isFinite(x));

      const results = await Promise.allSettled(
        normalized.map((productId: number) => apiClient.delete(`/products/${productId}`))
      );

      const failed = results
        .map((r, idx) => ({ r, productId: normalized[idx] }))
        .filter((x) => x.r.status === 'rejected');

      if (failed.length > 0) {
        const e: any = new Error(`Không xoá được ${failed.length} sản phẩm`);
        e.failedIds = failed.map((x) => x.productId);
        throw e;
      }
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
      const response = await apiClient.get(`/categories/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }
};