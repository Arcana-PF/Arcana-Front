"use client"

import { ShoppingCart, X, Sparkles, ArrowRight } from "lucide-react"
import { useCart } from "@/context/CartContext"
import { useEffect, useState } from "react"
import Link from "next/link"
import Swal from "sweetalert2"
import { useAuth } from "@/context/AuthContext"
import Image from "next/image";


const CartView = () => {
  const { cart, removeFromCart, clearCart } = useCart()
  const { userData } = useAuth()

  const [total, setTotal] = useState(0)

  useEffect(() => {
    const newTotal = cart.reduce(
      (sum, item) => sum + item.price * (item.quantity || 1),
      0
    )
    setTotal(newTotal)
  }, [cart])

  const handleRemoveItem = (id: number) => {
    Swal.fire({
      title: "¿Eliminar del carrito?",
      text: "Este artículo será removido de tu bolsa mística",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#7c3aed",
      background: "#0e0a1f",
      color: "#e5e7eb",
    }).then((result) => {
      if (result.isConfirmed) {
        removeFromCart(id)
        Swal.fire({
          title: "Artículo eliminado",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
          background: "#0e0a1f",
          color: "#e5e7eb",
        })
      }
    })
  }

  const handleCheckout = () => {
    Swal.fire({
      title: "¿Completar compra mística?",
      text: "Serás redirigido al plano de pago",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Continuar",
      cancelButtonText: "Seguir comprando",
      confirmButtonColor: "#facc15",
      cancelButtonColor: "#7c3aed",
      background: "#0e0a1f",
      color: "#e5e7eb",
    }).then((result) => {
      if (result.isConfirmed) {
        clearCart()
        // Aquí podrías redirigir o crear la orden
      }
    })
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-950">
        <div className="text-center">
          <Sparkles className="w-12 h-12 text-yellow-500 mx-auto mb-4 animate-pulse" />
          <p className="text-white text-lg">Consultando el grimorio del carrito...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <ShoppingCart className="w-10 h-10 text-yellow-500 mx-auto mb-2" />
        <h1 className="text-4xl font-extrabold text-yellow-500">Carro Arcano</h1>
      </div>

      {cart.length === 0 ? (
        <div className="bg-gray-900/70 rounded-2xl p-12 border border-yellow-500/30 text-center">
          <Sparkles className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Tu bolsa está vacía</h2>
          <p className="text-gray-300 mb-6">Aún no has añadido elementos a tu carrito</p>
          <Link
            href="/products"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-black bg-yellow-500 hover:bg-yellow-400 transition-colors"
          >
            Explorar todos nuestros productos.
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de productos */}
          <div className="lg:col-span-2 space-y-6">
            {cart.map((item) => (
              <div key={item.id} className="flex flex-col md:flex-row items-start bg-gray-900/60 p-6 rounded-xl border border-yellow-500/20">
                            <Image
                src={item.imgUrl || "/placeholder-item.jpg"}
                alt={item.name}
                width={96}        // 24 * 4 px (Tailwind 24 = 6rem = 96px)
                height={96}
                className="rounded-lg border border-yellow-500/30 object-cover"
                />
                <div className="md:ml-6 mt-4 md:mt-0 flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-sm text-yellow-500 mt-1">${item.price.toFixed(2)}</p>
                  <p className="text-sm text-gray-300 mt-2">
                    Total: ${(item.price * (item.quantity || 1)).toFixed(2)} ({item.quantity || 1} unidad/es)
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Resumen del pedido */}
          <div className="bg-gray-900/70 p-6 rounded-xl border border-yellow-500/30">
            <h2 className="text-xl font-semibold text-white mb-6">Resumen del Pedido</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-300">Subtotal</span>
                <span className="text-white">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Envío</span>
                <span className="text-white">$0.00</span>
              </div>
              <div className="pt-4 border-t border-yellow-500/20">
                <div className="flex justify-between">
                  <span className="text-gray-300">Total</span>
                  <span className="text-yellow-500 font-bold text-lg">${total.toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full mt-6 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold py-3 px-4 rounded-xl hover:from-yellow-400 hover:to-yellow-500 transition-all flex items-center justify-center"
              >
                Realizar Pago
                <Sparkles className="ml-2 w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CartView
