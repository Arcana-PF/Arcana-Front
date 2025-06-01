"use client";
import React, { useEffect } from "react";
import CartView from "@/components/Cart/CartComponent";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { userData } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!userData) {
      router.push("/login");
    }
  }, [userData, router]);

  if (!userData) return <div className="text-white p-8">Cargando...</div>;

  return (
    <main className="min-h-screen w-full bg-gray-950 text-white">
      <CartView />
    </main>
  );
}
