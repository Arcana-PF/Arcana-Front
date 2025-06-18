"use client";

import React from "react";
import { useCart } from "@/context/CartContext";
import CheckoutComponent from "../Checkout/CheckoutComponent";

const CartComponent = () => {
  const { cart, removeFromCart, updateCartQuantity, totalPrice } = useCart();

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white border-gray-200 rounded-3xl shadow-xl overflow-hidden p-8 space-y-6">
      <h2 className="text-3xl font-bold text-yellow-500">Tu carrito</h2>

      {/* ✅ Verificar productos en el carrito correctamente */}
      {cart.products.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">El carrito está vacío.</p>
      ) : (
        <ul className="space-y-4">
          {cart.products.map((item) => (
            <li
              key={item.id}
              className="flex items-center bg-gray-100 rounded-xl p-4 shadow-md"
            >
              <img
                src={item.imgUrl}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="ml-4 flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                <p className="text-sm text-gray-600">Precio: ${item.price.toFixed(2)}</p>
                <p className={`text-xs ${item.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                  {item.stock > 0 ? `Disponible (${item.stock})` : "Agotado"}
                </p>

                {/* ✅ Controles de cantidad asegurando valores correctos */}
                <div className="flex items-center gap-4 mt-2">
                  <button
                    onClick={() => updateCartQuantity(item.id, Math.max(1, (item.quantity ?? 1) - 1))}
                    disabled={(item.quantity ?? 1) <= 1}
                    className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 disabled:opacity-50"
                  >
                    -
                  </button>
                  <span className="text-lg font-medium text-gray-900">{item.quantity ?? 1}</span>
                  <button
                    onClick={() => updateCartQuantity(item.id, Math.min((item.quantity ?? 1) + 1, item.stock ?? 1))}
                    disabled={(item.quantity ?? 1) >= (item.stock ?? 1)}
                    className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 disabled:opacity-50"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="mt-2 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all"
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <h3 className="text-xl font-bold text-purple-700">
        Total: ${totalPrice.toFixed(2)}
      </h3>

      <div className="mt-6">
        <CheckoutComponent />
      </div>
    </div>
  );
};

export default CartComponent;