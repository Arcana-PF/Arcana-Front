"use client";

import { useAuth } from "@/context/AuthContext";
import { IProduct } from "@/types";
import { useCart } from "@/context/CartContext"; // ✅ Usa el contexto del carrito
import { Heart, ShoppingCart, Star } from "lucide-react";
import React, { useState } from "react";
import Swal from "sweetalert2";

const ProductDetail: React.FC<IProduct> = ({
  id, name, imgUrl, description, stock, price, categories, rating = 4.5, onAddToFavorites,
}) => {
  const { userData } = useAuth();
  const { addToCart } = useCart(); // ✅ Obtiene la función de agregar productos
  const [quantity, setQuantity] = useState(1);

  const category = categories.length > 0 ? categories[0].name : "Sin categoría";

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(Math.max(1, Math.min(stock, parseInt(e.target.value, 10) || 1)));
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

    addToCart({ id, name, imgUrl, description, stock, price, isActive: true, categories, quantity });

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

        {/* Rating */}
        {rating && (
          <div className="absolute bottom-3 left-3 flex items-center bg-white/90 px-2 py-1 rounded-full">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-medium ml-1">{rating.toFixed(1)}</span>
          </div>
        )}

        {/* Botón de favoritos */}
        <button
          className="absolute top-3 right-3 p-1.5 bg-white/80 rounded-full backdrop-blur-sm hover:bg-white transition-colors shadow-sm"
          onClick={(e) => {
            e.stopPropagation();
            onAddToFavorites?.();
          }}
        >
          <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
        </button>
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

          {/* Selector de cantidad con validación */}
          <div className="flex items-center gap-6">
            <input
              type="number"
              min="1"
              max={stock}
              value={quantity}
              onChange={handleQuantityChange}
              className="w-20 text-center bg-gray-800 text-white border border-yellow-600 rounded-lg py-2 text-lg"
            />
            <button
              className="p-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-white rounded-lg transition-all shadow-md flex items-center"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="ml-2 text-sm font-medium">Agregar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;