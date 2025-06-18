"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { ICart, IProduct } from "@/types";
import { useAuth } from "@/context/AuthContext";
import {
  addToCartHelper,
  updateCartItemQuantity,
  deleteCartItem,
  clearCartDB,
  fetchCartFromDB,
} from "@/utils/cart.helper";

interface CartContextType {
  cart: ICart;
  addToCart: (product: IProduct) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart debe usarse dentro de un CartProvider");
  return context;
};

// Estado inicial del carrito
const initialCart: ICart = {
  id: "cart-1",
  user: { id: "", name: "", email: "", phone: "", address: "", isAdmin: false, isActive: false },
  items: [],
  totalPrice: 0,
  isActive: true,
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { userData } = useAuth();
  const [cart, setCart] = useState<ICart>(initialCart);

  // Carga inicial del carrito basado en el usuario autenticado
  useEffect(() => {
    const loadCart = async () => {
      if (userData?.user?.id) {
        const storedCart = await fetchCartFromDB(userData.token);
        setCart(storedCart || { ...initialCart, user: userData.user });
      } else {
        setCart(initialCart);
      }
    };
    loadCart();
  }, [userData]);

  const totalPrice = useMemo(() => cart.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0), [cart.items]);

  const addToCart = useCallback(async (product: IProduct) => {
    if (!userData) return;
    setCart(prevCart => addToCartHelper(prevCart, product, 1));
  }, [userData]);

  const updateCartQuantity = useCallback(async (itemId: string, quantity: number) => {
    if (!userData) return;
    const updatedItem = await updateCartItemQuantity(itemId, quantity, userData.token);
    if (!updatedItem) return;
    setCart(prevCart => {
      const updatedItems = prevCart.items.map(item =>
        item.id === itemId ? { ...item, quantity: updatedItem.quantity } : item
      );
      return { ...prevCart, items: updatedItems, totalPrice: totalPrice };
    });
  }, [userData]);

  const removeFromCart = useCallback(async (itemId: string) => {
    if (!userData) return;
    const success = await deleteCartItem(itemId, userData.token);
    if (!success) return;
    setCart(prevCart => {
      const updatedItems = prevCart.items.filter(item => item.id !== itemId);
      return { ...prevCart, items: updatedItems, totalPrice: totalPrice };
    });
  }, [userData]);

  const clearCart = useCallback(async () => {
    if (!userData) return;
    const success = await clearCartDB(userData.token);
    if (!success) return;
    setCart(prevCart => ({
      ...prevCart,
      items: [],
      totalPrice: 0,
    }));
  }, [userData]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, updateCartQuantity, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};