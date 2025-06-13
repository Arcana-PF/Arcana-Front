"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { IProduct, ICart } from "@/types";
import { useAuth } from "@/context/AuthContext";
import {
  addToCartHelper,
  removeFromCartHelper,
  updateCartQuantityHelper,
  clearCartHelper,
  calculateTotalPrice,
  fetchCartFromDB,
  saveCartToDB,
} from "@/utils/cart.helper"; // ✅ Importa helpers

interface CartContextType {
  cart: ICart;
  addToCart: (product: IProduct) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  updateCartQuantity: (id: string, quantity: number) => void;
  totalPrice: number;
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
  const [cart, setCart] = useState<ICart>({ id: "cart-1", products: [], totalPrice: 0, quantity: 0, priceAtPurchase: 0 });

  // ✅ Cargar carrito desde la base de datos cuando el usuario cambia
  useEffect(() => {
    const loadCart = async () => {
      if (userData?.user?.id) {
        const storedCart = await fetchCartFromDB(userData.user.id, userData.token);
        setCart(storedCart || { id: "cart-1", products: [], totalPrice: 0, quantity: 0, priceAtPurchase: 0 });
      } else {
        setCart({ id: "cart-1", products: [], totalPrice: 0, quantity: 0, priceAtPurchase: 0 });
      }
    };

    loadCart();
  }, [userData]);

  // ✅ Memoizar total del carrito
  const totalPrice = useMemo(() => calculateTotalPrice(cart.products), [cart]);

  // ✅ Agregar producto al carrito
const addToCart = useCallback(async (product: IProduct) => {
  if (!userData || !userData.user?.id) return; //  Asegura que userData no sea null

  const updatedCart = addToCartHelper(cart, product, 1);
  setCart(updatedCart);
  await saveCartToDB(updatedCart.products, userData.token);
}, [cart, userData]);

  // ✅ Remover producto del carrito
const removeFromCart = useCallback(async (productId: string) => {
  if (!userData || !userData.user?.id) return; //  Asegura que userData no sea null

  const updatedCart = removeFromCartHelper(cart, productId);
  setCart(updatedCart);
  await saveCartToDB(updatedCart.products, userData.token);
}, [cart, userData]);

  // ✅ Vaciar el carrito
  const clearCart = useCallback(async () => {
  if (!userData || !userData.user?.id) return; // Asegura que userData no sea null
    const emptyCart = clearCartHelper();
    setCart(emptyCart);
    await saveCartToDB(emptyCart.products, userData.token);
  }, [userData]);

  // ✅ Actualizar cantidad de productos
  const updateCartQuantity = useCallback(async (id: string, quantity: number) => {
    
  if (!userData || !userData.user?.id) return; // ✅ Asegura que userData no sea null
    const updatedCart = updateCartQuantityHelper(cart, id, quantity);
    setCart(updatedCart);
    await saveCartToDB(updatedCart.products, userData.token);
  }, [cart, userData]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, updateCartQuantity, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};