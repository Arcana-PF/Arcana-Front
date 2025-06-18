'use client';
import { useAuth } from '@/context/AuthContext';
import { IOrder } from '@/types';
import { getOrders } from '@/utils/Orders.helper';
import { useEffect, useState, useCallback } from 'react';

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
          setOrders(result.data); // Asumiendo que el helper retorna { success: boolean, data: IOrder[] }
        } else {
          setError(typeof result.error === 'string' ? result.error : 'Error desconocido al cargar órdenes');
        }
      } catch (err: any) {
        setError(err.message || 'Error inesperado');
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
      <div className="min-h-screen flex items-center justify-center text-gray-300 font-serif">
        Cargando órdenes...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 font-serif">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-900 via-black to-gray-900 min-h-screen p-6 text-gray-300 font-serif relative">
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
          orders.map((item) => (
            <div
              key={item.id}
              className="border border-purple-500 rounded-md p-4 mb-4 bg-purple-900/30 hover:border-yellow-400 hover:shadow-xl transition-all duration-300"
            >
              <p className="text-lg font-semibold text-yellow-300">
                ⌘ Estado: <span className="uppercase">{item.status}</span>
              </p>
              <p className="text-sm text-gray-400">
                ⏳ Fecha: {new Date(item.date).toLocaleDateString()}
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