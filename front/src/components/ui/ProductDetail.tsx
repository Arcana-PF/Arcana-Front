'use client'
import { useAuth } from '@/context/AuthContext';
import { IProduct } from '@/types';
import React from 'react';
import Swal from 'sweetalert2';

const ProductDetail: React.FC<IProduct> = ({ id, name, imgUrl, description, stock, price, category }) => {
  const { userData } = useAuth();

  const handleAddToCart = () => {
    if (!userData?.token) {
      Swal.fire({
        icon: "warning",
        title: "Inicia sesión",
        text: "Debes iniciar sesión para agregar productos al carrito.",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Ok",
      });
      return;
    }

    const cart: IProduct[] = JSON.parse(localStorage.getItem("cart") || "[]");
    const productExist = cart.some((item) => item.id === id);

    if (productExist) {
      Swal.fire({
        icon: "info",
        title: "Producto en carrito",
        text: "Este producto ya está en el carrito.",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Entendido",
      });
    } else {
      cart.push({ id, name, imgUrl, description, stock, price, category });
      localStorage.setItem("cart", JSON.stringify(cart));
      Swal.fire({
        icon: "success",
        title: "¡Producto agregado!",
        text: "El producto ha sido enviado al carrito.",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Ver carrito",
      });
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-purple-800 border border-yellow-500 rounded-lg shadow-md overflow-hidden p-6 space-y-4">
      <h1 className="text-2xl font-bold text-white">{name}</h1>
      <img
        src={imgUrl}
        alt={name}
        className="w-full h-64 object-cover rounded-md"
      />
      <h3 className="text-lg text-gray-300">{description}</h3>
      <p className="text-gray-300">
        Price: <span className="font-semibold">${price}</span>
      </p>
      <p className="text-gray-300">
        Stock: <span className="font-semibold">{stock}</span>
      </p>
      <button
        onClick={handleAddToCart}
        className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black hover:from-yellow-400 hover:to-yellow-500 hover:scale-[1.02] hover:shadow-lg hover:shadow-yellow-500/25 active:scale-[0.98] py-2 px-4 rounded transition-colors duration-200"
      >
        Agregar al carrito
      </button>
    </div>
  );
};

export default ProductDetail;