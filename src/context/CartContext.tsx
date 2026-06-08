"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  cartItemId?: string; // ID duy nhất cho mỗi dòng trong giỏ hàng
  name: string;
  price: number;
  quantity: number;
  image: string;
  selectedOptions?: any;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from LocalStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('anhly_cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to LocalStorage whenever items change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('anhly_cart', JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addToCart = (newItem: CartItem) => {
    setItems(prev => {
      // Vì sản phẩm có cấu hình tùy chọn, ta tạo một cartItemId duy nhất cho mỗi lần add
      const cartItemWithId = {
        ...newItem,
        cartItemId: newItem.cartItemId || `${newItem.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      };
      
      // Nếu không có options phức tạp, ta có thể gộp. 
      // Nhưng an toàn nhất là thêm thành dòng mới nếu có selectedOptions
      if (!newItem.selectedOptions) {
        const existingIndex = prev.findIndex(i => i.id === newItem.id && !i.selectedOptions);
        if (existingIndex >= 0) {
          const newItems = [...prev];
          newItems[existingIndex].quantity += newItem.quantity;
          return newItems;
        }
      }
      
      return [...prev, cartItemWithId];
    });
    setIsCartOpen(true); // Tự động mở giỏ hàng khi thêm thành công
  };

  const removeFromCart = (cartItemId: string) => {
    setItems(prev => prev.filter(i => (i.cartItemId || i.id) !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setItems(prev => prev.map(i => (i.cartItemId || i.id) === cartItemId ? { ...i, quantity } : i));
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      items, addToCart, removeFromCart, updateQuantity, clearCart,
      totalItems, totalPrice, isCartOpen, setIsCartOpen
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
