export type Customer = {
  id: string;
  phone: string;
  name: string;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export type Address = {
  province: number;
  district: number;
  ward: number;
  detail: string;
  receiverPhone: string;
};

export type ShippingMethod = 'standard' | 'economy' | 'express';

export type OrderState = {
  step: number;
  customer: Customer | null;
  products: Product[];
  address: Address;
  shipping: {
    method: ShippingMethod;
    fee: number;
    estimatedDelivery: string;
  };
  note: string;
};
