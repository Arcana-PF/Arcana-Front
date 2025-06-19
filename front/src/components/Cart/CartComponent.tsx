"use client";

import React from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import CheckoutComponent from "../Checkout/CheckoutComponent";

const CartComponent = () => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    totalPrice,
    isCartReady,
  } = useCart();

  const { userData } = useAuth();

  // 🌀 Loader mientras el carrito se sincroniza con el backend
  if (!isCartReady || !userData?.user?.id) {
    return (
      <div className="max-w-lg mx-auto mt-10 bg-white border-gray-200 rounded-3xl shadow-xl p-8 space-y-6 animate-pulse">
        <div className="h-6 bg-yellow-300/40 rounded w-1/3" />
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-300/50 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-300/40 rounded w-2/3" />
                <div className="h-3 bg-gray-300/30 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
        <div className="h-4 bg-purple-300/40 rounded w-1/3 mx-auto" />
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white border-gray-200 rounded-3xl shadow-xl overflow-hidden p-8 space-y-6">
      <h2 className="text-3xl font-bold text-yellow-500">Tu carrito</h2>

      {cart.items.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">El carrito está vacío.</p>
      ) : (
        <ul className="space-y-4">
          {cart.items.map((item) => (
            <li
              key={item.id}
              className="flex items-center bg-gray-100 rounded-xl p-4 shadow-md"
            >
              <img
                src={item.product.imgUrl}
                alt={item.product.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="ml-4 flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{item.product.name}</h3>
                <p className="text-sm text-gray-600">
                  Precio: ${Number(item.product.price).toFixed(2)}
                </p>
                <p
                  className={`text-xs ${
                    item.product.stock > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {item.product.stock > 0
                    ? `Disponible (${item.product.stock})`
                    : "Agotado"}
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <button
                    onClick={() =>
                      updateCartQuantity(item.id, Math.max(1, item.quantity - 1))
                    }
                    disabled={item.quantity <= 1}
                    className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 disabled:opacity-50"
                  >
                    -
                  </button>
                  <span className="text-lg font-medium text-gray-900">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateCartQuantity(
                        item.id,
                        Math.min(item.quantity + 1, item.product.stock)
                      )
                    }
                    disabled={item.quantity >= item.product.stock}
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
        Total: ${Number(totalPrice).toFixed(2)}
      </h3>

      {cart.items.length > 0 && (
        <button
          onClick={clearCart}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all"
        >
          Vaciar carrito
        </button>
      )}

      <div className="mt-6">
        <CheckoutComponent />
      </div>
    </div>
  );
};

export default CartComponent;