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
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  updateCartQuantity: (id: string, quantity: number) => void;
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

  // ✅ Cargar carrito desde localStorage cuando cambia el usuario
  useEffect(() => {
    if (userData?.user?.id) {
      try {
        const storedCart = localStorage.getItem(`cart_${userData.user.id}`);
        setCart(storedCart ? JSON.parse(storedCart) : []);
      } catch (error) {
        console.error("Error al recuperar el carrito:", error);
      }
    } else {
      setCart([]);
    }
  }, [userData]);

  // ✅ Guardar carrito en localStorage cuando cambian los productos
  useEffect(() => {
    if (userData?.user?.id) {
      try {
        localStorage.setItem(`cart_${userData.user.id}`, JSON.stringify(cart));
      } catch (error) {
        console.error("Error al guardar el carrito:", error);
      }
    }
  }, [cart, userData]);

  // ✅ Agregar producto al carrito con límite de stock
  const addToCart = (product: IProduct) => {
    setCart((prevCart) => {
      const exist = prevCart.find((p) => p.id === product.id);
      if (exist) {
        const updatedQuantity = Math.min(exist.quantity + 1, product.stock);
        return prevCart.map((p) =>
          p.id === product.id ? { ...p, quantity: updatedQuantity } : p
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  // ✅ Eliminar producto del carrito
  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((product) => product.id !== productId));
  };

  // ✅ Vaciar el carrito y limpiar localStorage
  const clearCart = () => {
    setCart([]);
    if (userData?.user?.id) {
      localStorage.removeItem(`cart_${userData.user.id}`);
    }
  };

  // ✅ Actualizar cantidad con restricciones
  const updateCartQuantity = (id: string, quantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, Math.min(quantity, item.stock)) } : item
      )
    );
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, updateCartQuantity }}>
      {children}
    </CartContext.Provider>
  );
};