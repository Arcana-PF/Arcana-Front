'use client';
import { useAuth } from '@/context/AuthContext';
import { IOrder } from '@/types';
import { getOrders } from '@/utils/Orders.helper';
import { useEffect, useState, useCallback } from 'react';

const OrdersView = () => {
  const { userData } = useAuth();
  const [orders, setOrders] = useState<IOrder[]>([]);

  const loadOrders = useCallback(async () => {
    if (!userData?.token) return;
    
    try {
      const response = await getOrders(userData.token);
      setOrders(response);
    } catch (error) {
      console.error("Error al obtener órdenes:", error);
    }
  }, [userData?.token]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  return (
    <div className="bg-gradient-to-br from-purple-900 via-black to-gray-900 min-h-screen p-6 text-gray-300 font-serif">
      {/* Efecto de luz mágica */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-yellow-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto max-w-3xl bg-black/80 backdrop-blur-md rounded-lg shadow-2xl border border-yellow-500/30 p-6 relative z-10">
        <h1 className="text-3xl font-bold text-center mb-6 text-yellow-400 tracking-wide">
          ✦ Órdenes Místicas ✦
        </h1>

        {orders.length ? (
          orders.map((order) => (
            <div
              key={order.id}
              className="border border-purple-500 rounded-md p-4 mb-4 bg-purple-900/30 hover:border-yellow-400 hover:shadow-xl transition-all duration-300"
            >
              <p className="text-lg font-semibold text-yellow-300">
                ⌘ Estado: <span className="uppercase">{order.status}</span>
              </p>
              <p className="text-sm text-gray-400">
                ⏳ Fecha: {new Date(order.date).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-400">
                🔗 Order ID: <span className="text-yellow-400">{order.orderId}</span>
              </p>
              <p className="text-sm text-gray-400">
                🏠 Local Order ID: <span className="text-yellow-400">{order.localOrderId}</span>
              </p>
              <p className="text-sm text-gray-500">
                💰 Total: ${Number(order.totalPrice).toFixed(2)}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 italic">
            ✦ Aún no tienes órdenes ✦
          </div>
        )}
      </div>
    </div>  
  );
};

export default OrdersView;