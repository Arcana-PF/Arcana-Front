'use client'
import { useAuth } from '@/context/AuthContext';
import { IProduct } from '@/types';
import React, { useState } from 'react';
import Swal from 'sweetalert2';

const ProductDetail: React.FC<IProduct> = ({ id, name, imgUrl, description, stock, price, category }) => {
  const { userData } = useAuth();
  const [quantity, setQuantity] = useState(1); // Estado para manejar la cantidad seleccionada

  const handleAddToCart = () => {
    if (!userData?.token) {
      Swal.fire({
        icon: "warning",
        title: "Inicia sesión",
        text: "Debes iniciar sesión para agregar productos al carrito.",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Ir al login",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/login";
        }
      });
      return;
    }

    let cart: IProduct[] = [];
    try {
      const storedCart = localStorage.getItem("cart");
      if (storedCart) {
        cart = JSON.parse(storedCart);
      }
    } catch (error) {
      console.error("Error al parsear el carrito desde localStorage:", error);
    }

    const productIndex = cart.findIndex((item) => item.id === id);
    
    if (productIndex !== -1 && cart[productIndex]) {
      if ((cart[productIndex].quantity ?? 0) + quantity <= stock) { 
        cart[productIndex]!.quantity = (cart[productIndex]!.quantity ?? 0) + quantity;
      } else {
        Swal.fire({
          icon: "error",
          title: "Stock insuficiente",
          text: "No puedes agregar más unidades de este producto.",
          confirmButtonColor: "#ef4444",
        });
        return;
      }
    } else {
      if (stock >= quantity) {
        cart.push({ id, name, imgUrl, description, stock, price, category, quantity });
      } else {
        Swal.fire({
          icon: "error",
          title: "Stock insuficiente",
          text: "Solo quedan algunas unidades disponibles.",
          confirmButtonColor: "#ef4444",
        });
        return;
      }
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    Swal.fire({
      icon: "success",
      title: "¡Producto agregado!",
      text: `Se han agregado ${quantity} unidad/es al carrito.`,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Ver carrito",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "/cart";
      }
    });
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-purple-800 border border-yellow-500 rounded-lg shadow-md overflow-hidden p-6 space-y-4">
      <h1 className="text-2xl font-bold text-white">{name}</h1>
      <img src={imgUrl} alt={name} className="w-full h-64 object-cover rounded-md" />
      <h3 className="text-lg text-gray-300">{description}</h3>
      <p className="text-gray-300">Price: <span className="font-semibold">${price}</span></p>
      <p className="text-gray-300">Stock: <span className="font-semibold">{stock}</span></p>
      
      {/* Selector de cantidad */}
      <div className="flex items-center gap-4">
        <input
          type="number"
          min="1"
          max={stock}
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
          className="w-16 text-center bg-gray-800 text-white border border-yellow-500 rounded-md"
        />
        <button
          onClick={handleAddToCart}
          className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black hover:from-yellow-400 hover:to-yellow-500 py-2 px-4 rounded transition-all duration-200"
        >
          Agregar al carrito
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;