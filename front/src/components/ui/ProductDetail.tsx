"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { IProduct } from "@/types";
import Rating from "../Rating/Rating";
import ReviewForm from "@/components/Review/ReviewFormProps";
import { ShoppingCart } from "lucide-react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const ProductDetail: React.FC<IProduct> = ({
  id, name, imgUrl, description, stock, price, rating,
}) => {
  const { userData } = useAuth();
  const router = useRouter();
  const [hasPurchased, setHasPurchased] = useState(false);
  const [loadingPurchase, setLoadingPurchase] = useState(true);

  const handleAddToCart = async () => {
    if (!userData?.token) {
      return Swal.fire({
        icon: "warning",
        title: "Inicia sesión",
        text: "Debes iniciar sesión para agregar productos.",
        confirmButtonText: "Ir al login",
        confirmButtonColor: "#7e22ce",
      }).then((r) => r.isConfirmed && router.push("/login"));
    }

    try {
      const resp = await fetch(`${API_URL}/cart/items`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userData.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId: id, quantity: 1 }),
      });

      if (!resp.ok) throw new Error((await resp.json()).message);

      Swal.fire({
        icon: "success",
        title: "¡Agregado al carrito!",
        background: "#7e22ce",
        color: "#fff",
        iconColor: "#facc15",
      });
    } catch (e: any) {
      Swal.fire("Error", e.message || "No se pudo agregar", "error");
    }
  };

  useEffect(() => {
    const checkIfPurchased = async () => {
      if (!userData?.token) return setLoadingPurchase(false);

      try {
        const res = await fetch(`${API_URL}/orders/myOrders`, {
          headers: { Authorization: `Bearer ${userData.token}` },
        });

        const orders = await res.json();
        console.log("📦 Órdenes recibidas:", orders);

        const found = orders.some((order: any) =>
          order?.orderDetail?.items?.some(
            (item: any) => String(item?.product?.id) === String(id)
          )
        );

        setHasPurchased(found);
        console.log("✅ Producto comprado:", found);
      } catch (err) {
        console.error("❌ Error verificando compra:", err);
        setHasPurchased(false);
      } finally {
        setLoadingPurchase(false);
      }
    };

    checkIfPurchased();
  }, [userData?.token, id]);

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white rounded-3xl shadow p-8 space-y-6">
      <h1 className="text-3xl font-bold text-yellow-500">{name}</h1>
      <div className="relative w-full bg-gray-100 rounded-xl overflow-hidden">
        <img src={imgUrl} alt={name} className="w-full object-cover" loading="lazy" />
        {stock === 0 && (
          <div className="absolute top-3 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
            Agotado
          </div>
        )}
        <div className="absolute bottom-3 left-3 bg-white/90 rounded-full p-2">
          <Rating value={rating} />
        </div>
      </div>

      <p className="text-sm text-gray-500">{description}</p>

      <div className="flex justify-between items-center">
        <div>
          <p className="text-xl font-bold text-purple-700">
            ${price.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
          </p>
          <p className={`text-xs ${stock > 0 ? "text-green-600" : "text-red-600"}`}>
            {stock > 0 ? `Disponible (${stock})` : "Agotado"}
          </p>
        </div>

        {!userData?.user?.isAdmin && (
          <button
            onClick={handleAddToCart}
            disabled={stock <= 0}
            className={`p-3 rounded-lg text-white ${
              stock > 0 ? "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:opacity-80" : "bg-gray-300"
            }`}
          >
            <ShoppingCart className="w-5 h-5 inline-block" />
            <span className="ml-2">Agregar</span>
          </button>
        )}
      </div>

      {userData?.token && !loadingPurchase && (
        <ReviewForm
          productId={String(id)}
          userToken={userData.token}
          existingRating={rating}
          hasPurchased={hasPurchased}
        />
      )}
    </div>
  );
};

export default ProductDetail;
