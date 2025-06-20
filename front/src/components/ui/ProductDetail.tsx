"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { IProduct } from "@/types";
import { useCart } from "@/context/CartContext";
import { ShoppingCart } from "lucide-react";
import Swal from "sweetalert2";
import Rating from "../Rating/Rating";

const ProductDetail: React.FC<IProduct> = ({
  id,
  name,
  imgUrl,
  description,
  stock,
  price,
  categories,
  rating,
}) => {
  const { userData } = useAuth();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const category = categories.length > 0 ? categories[0].name : "Sin categoría";

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value, 10) || 1;
    setQuantity(Math.max(1, Math.min(stock, newQuantity)));
  };

  const handleAddToCart = () => {
    if (!userData?.token) {
      Swal.fire({
        icon: "warning",
        title: "Inicia sesión",
        text: "Debes iniciar sesión para agregar productos al carrito.",
      });
      return;
    }

    addToCart({
      id,
      name,
      imgUrl,
      description,
      stock,
      price,
      isActive: true,
      categories,
      quantity,
    });

    Swal.fire({
      icon: "success",
      title: "¡Producto agregado!",
      text: `Se han agregado ${quantity} unidad/es al carrito.`,
      confirmButtonText: "Ver carrito",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "/cart";
      }
    });
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white border-gray-200 rounded-3xl shadow-xl overflow-hidden p-8 space-y-6">
      <h1 className="text-3xl font-bold text-yellow-500">{name}</h1>

      {/* Imagen del producto */}
      <div className="relative w-full h-auto bg-gray-100">
        <img
          src={imgUrl}
          alt={`${name} - ${category}`}
          className="w-full object-cover transition-transform duration-500 hover:scale-105"
          loading="lazy"
        />

        {/* Producto agotado: visible para todos */}
        {stock === 0 && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow z-10">
            Producto Agotado espera a que llegue el nuevo stock
          </div>
        )}

        {/* Rating */}
        <div className="absolute bottom-3 left-3 bg-white/90 px-2 py-1 rounded-full">
          <Rating value={rating} />
        </div>

      </div>

      {/* Descripción y detalles */}
      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-1">{name}</h3>
        <p className="text-sm text-gray-500 mb-3">{description}</p>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-purple-700">
              ${price.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
            </p>
            <p className={`text-xs ${stock > 0 ? "text-green-600" : "text-red-600"}`}>
              {stock > 0 ? `Disponible (${stock})` : "Agotado"}
            </p>
          </div>

          {/* Selector de cantidad y botón para agregar al carrito */}
          {/* Selector de cantidad y botón para agregar al carrito */}
          {!userData?.user.isAdmin && (
            <div className="flex items-center gap-6">
              <input
                type="number"
                min="1"
                max={stock}
                value={quantity}
                onChange={handleQuantityChange}
                disabled={stock === 0}
                className="w-20 text-center bg-gray-800 text-white border border-yellow-600 rounded-lg py-2 text-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
              />
              <button
                onClick={handleAddToCart}
                disabled={stock === 0}
                className={`p-3 rounded-lg transition-all shadow-md flex items-center text-white
        ${stock > 0
                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500'
                    : 'bg-gray-300 cursor-not-allowed opacity-50'
                  }`}
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="ml-2 text-sm font-medium">Agregar</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;