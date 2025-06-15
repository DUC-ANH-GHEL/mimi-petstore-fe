import React, { createContext, useContext, useState } from 'react';

export interface CartProduct {
  title: string;
  image: string;
  price: string;
  quantity: number;
}

interface CartContextType {
  cart: CartProduct[];
  addToCart: (product: Omit<CartProduct, 'quantity'>) => void;
  removeFromCart: (title: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState<CartProduct[]>([]);

  const addToCart = (product: Omit<CartProduct, 'quantity'>) => {
    setCart(prev => {
      const idx = prev.findIndex(p => p.title === product.title);
      if (idx !== -1) {
        // Đã có, tăng số lượng
        const updated = [...prev];
        updated[idx].quantity += 1;
        return updated;
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (title: string) => {
    setCart(prev => prev.filter(p => p.title !== title));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}; 