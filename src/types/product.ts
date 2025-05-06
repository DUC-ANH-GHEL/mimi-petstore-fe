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
    is_active: boolean;
    category_id: number;
    labels: string[];
    images: File[] | string[];
    specs: { key: string; value: string }[];
    slug: string;
    metaTitle: string;
    metaDescription: string;
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