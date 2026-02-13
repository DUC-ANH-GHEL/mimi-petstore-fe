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
  affiliate: number;
  weight: number;
  length: number;
  width: number;
  height: number;
  stock: number;
  status: string;
  is_active: boolean;
  category_id: number;
  labels: string[];
  images: Array<string | File>;
  specs: { key: string; value: string }[];
  slug: string;
  metaTitle: string;
  metaDescription: string;
}

export interface ProductFormDataUpdate extends ProductFormData {
  id: number;
  listImageCurrent: string[];
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