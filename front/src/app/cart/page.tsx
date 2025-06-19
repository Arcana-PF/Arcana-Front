"use client";

import CartView from "@/components/Cart/CartComponent";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function CartPage() {
  const { isCartReady } = useCart();
  const { userData } = useAuth();

  if (!isCartReady || !userData?.user?.id) {
    return (
      <main className="min-h-screen flex items-center justify-center text-gray-500 text-lg animate-pulse">
        Invocando el contenido del carrito...
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <CartView />
    </main>
  );
}