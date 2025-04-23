// src/types/product.ts
export interface ProductFormData {
    name: string;
    description: string;
    sku: string;
    price: number;
    affiliate: number;
    stock: number;
    weight: number;
    length: number;
    width : number;
    height: number;
    status: 'active' | 'hidden' | 'out_of_stock';
    category: string;
    labels: string[];
    images: File[];
    specs: { key: string; value: string }[];
    slug: string;
    metaTitle: string;
    metaDescription: string;
  }
  
  export interface FormError {
    [key: string]: string;
  }