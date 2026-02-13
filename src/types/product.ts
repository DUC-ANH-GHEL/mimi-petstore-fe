// src/types/product.ts
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  images: string[];
  category_id: number;
  sku: string;
  stock: number;
  status: 'active' | 'inactive';
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface ProductFormData {
  name: string;
  description: string;
  sku: string;
  price: number;
  sale_price?: number;
  currency?: string;
  affiliate: number;
  weight: number;
  length: number;
  width: number;
  height: number;
  stock: number;
  status: string;
  is_active: boolean;
  category_id: number;
  brand?: string;
  material?: string;
  size?: string;
  color?: string;
  pet_type?: string;
  season?: string;
  labels: string[];
  images: Array<string | File>;
  specs: { key: string; value: string }[];
  slug: string;
  metaTitle: string;
  metaDescription: string;

  // OpenAPI expects `variants` as a JSON string ("JSON array of variants").
  // We keep a flexible type so UI can work with structured variants too.
  variants?:
    | string
    | Array<{
        sku?: string;
        size?: string;
        color?: string;
        material?: string;
        price?: number;
        sale_price?: number;
        stock?: number;
        is_active?: boolean;
      }>;
}

export interface ProductFormDataUpdate extends ProductFormData {
  id: number;
  // Kept for UI compatibility; backend ProductUpdate no longer requires this.
  listImageCurrent?: string[];
}

export interface FormError {
  [key: string]: string;
}

export interface ProductImage{
  product_id: number;
  image_url: string;
  is_primary: boolean;
  id: number;
}