"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { IProduct } from "@/types";
import { useAuth } from "@/context/AuthContext";

interface CartItem extends IProduct {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: IProduct) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de un CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { userData } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);

  // Cargar carrito desde localStorage
  useEffect(() => {
    if (userData?.user?.id) {
      const storedCart = localStorage.getItem(`cart_${userData.user.id}`);
      setCart(storedCart ? JSON.parse(storedCart) : []);
    }
  }, [userData]);

  // Guardar carrito en localStorage
  useEffect(() => {
    if (userData?.user?.id) {
      localStorage.setItem(`cart_${userData.user.id}`, JSON.stringify(cart));
    }
  }, [cart, userData]);

  // Agregar producto al carrito
  const addToCart = (product: IProduct) => {
    setCart((prevCart) => {
      const exist = prevCart.find((p) => p.id === product.id);
      if (exist) {
        return prevCart.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  // Eliminar producto del carrito
  const removeFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter((product) => product.id !== productId));
  };

  // Vaciar el carrito y limpiar localStorage
  const clearCart = () => {
    setCart([]);
    if (userData?.user?.id) {
      localStorage.removeItem(`cart_${userData.user.id}`);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
