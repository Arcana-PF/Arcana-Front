"use client";
import { useAuth } from "@/context/AuthContext";
import { IOrder } from "@/types";
import { getOrders } from "@/utils/Orders.helper";
import { useEffect, useState, useCallback } from "react";
import { Sparkles } from "lucide-react";

const OrdersView = () => {
  const { userData } = useAuth();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    if (userData?.token) {
      try {
        const result = await getOrders(userData.token);
        if (result.success) {
          setOrders(result.data);
        } else {
          setError(typeof result.error === "string" ? result.error : "Error desconocido al invocar órdenes");
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Error inesperado");
      } finally {
        setLoading(false);
      }
    }
  }, [userData?.token]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-gray-900 flex items-center justify-center relative text-gray-200">
        <div className="absolute top-1/3 left-1/3 w-60 h-60 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" />
        <p className="text-xl font-medium tracking-wide animate-pulse">⏳ Invocando tus órdenes místicas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-black to-gray-900 text-red-400 relative">
        <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
        <p className="text-lg font-semibold">✖ {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-900 via-black to-gray-900 min-h-screen py-10 px-4 text-gray-300 relative font-serif">
      {/* Fondo mágico */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-yellow-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-3xl mx-auto bg-black/80 backdrop-blur-md rounded-xl border border-yellow-500/30 shadow-xl p-6 relative z-10">
        <div className="flex items-center justify-center mb-6">
          <Sparkles className="w-6 h-6 text-yellow-500 mr-2 animate-pulse" />
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent tracking-wide">
            Órdenes Místicas
          </h1>
        </div>

        {orders.length ? (
          orders.map((order) => (
            <div
              key={order.id}
              className="bg-gray-900/50 border border-yellow-500/20 p-4 rounded-xl mb-4 hover:border-yellow-400 transition-all duration-300"
            >
              <p className="text-yellow-400 text-lg font-semibold mb-2">⌘ Estado: <span className="uppercase">{order.status}</span></p>
              <p className="text-sm text-gray-400">⏳ Fecha: {new Date(order.date).toLocaleDateString()}</p>
            </div>
          ))
        ) : (
          <div className="text-center italic text-yellow-500">✦ Aún no has realizado ninguna orden ✦</div>
        )}
      </div>
    </div>
  );
};

export default OrdersView;