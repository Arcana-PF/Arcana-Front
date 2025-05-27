"use client";

import { useAuth } from '@/context/AuthContext';
import { User, Package, Clock, MapPin, Edit, Phone } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

type Pedido = {
  id: number;
  fecha: string;
  total: number;
  estado: string;
};

type UserDetails = {
  direccion: string;
  telefono: string;
};

export default function PerfilUsuario() {
  const { user, logout } = useAuth();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [userDetails, setUserDetails] = useState<UserDetails>({
    direccion: '',
    telefono: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // fetch a la data del usuario
      // const userRes = await fetch(`/api/user/details`);
      // const userData = await userRes.json();
      // setUserDetails(userData);
       
      //fetch a la data de pedidos/ordenes
      // const ordersRes = await fetch(`/api/user/orders`);
      // const ordersData = await ordersRes.json();
      // setPedidos(ordersData);

      
      setPedidos([]);
      setUserDetails({
        direccion: '',
        telefono: ''
      });

    } catch (err) {
      setError('Error al cargar los datos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    fetchUserData();
  };

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-purple-50 p-4">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center">
          <User className="w-12 h-12 mx-auto text-purple-500 mb-4" />
          <h2 className="text-xl font-bold text-purple-900 mb-2">Acceso requerido</h2>
          <p className="text-purple-700 mb-6">Debes iniciar sesión para ver tu perfil</p>
          <Link 
            href="/login" 
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Encabezado */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-purple-900">Mi Perfil</h1>
          <button 
            onClick={logout}
            className="text-sm text-purple-700 hover:text-purple-900 flex items-center gap-1"
          >
            <span>Cerrar sesión</span>
          </button>
        </div>

        {/* Tarjeta de información */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div className="bg-purple-100 p-2 rounded-full mr-3">
                  <User className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-lg font-semibold">Información Personal</h2>
              </div>
              <Link 
                href="/perfil/editar" 
                className="text-sm text-purple-600 hover:text-purple-800 flex items-center gap-1"
              >
                <Edit className="w-4 h-4" />
                Editar
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-purple-50 p-3 rounded-lg">
                <h3 className="text-xs font-medium text-purple-700 mb-1">Nombre</h3>
                <p className="font-medium">{user.name}</p>
              </div>
              
              <div className="bg-purple-50 p-3 rounded-lg">
                <h3 className="text-xs font-medium text-purple-700 mb-1">Email</h3>
                <p className="font-medium">{user.email}</p>
              </div>

              <div className="bg-purple-50 p-3 rounded-lg">
                <h3 className="text-xs font-medium text-purple-700 mb-1">Teléfono</h3>
                <div className="flex items-center gap-1">
                  <Phone className="w-4 h-4 text-purple-500" />
                  <p className="font-medium">
                    {userDetails.telefono || 'No especificado'}
                  </p>
                </div>
              </div>

              <div className="bg-purple-50 p-3 rounded-lg md:col-span-2">
                <h3 className="text-xs font-medium text-purple-700 mb-1">Dirección</h3>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-purple-500" />
                  <p className="font-medium">
                    {userDetails.direccion || 'No especificada'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de pedidos */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="bg-purple-100 p-2 rounded-full mr-3">
                <Package className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-lg font-semibold">Mis Pedidos</h2>
            </div>

            {error ? (
              <div className="text-center py-8 text-red-500">
                <p>{error}</p>
                <button 
                  onClick={handleRetry}
                  className="mt-4 text-sm text-purple-600 hover:text-purple-800"
                >
                  Reintentar
                </button>
              </div>
            ) : loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
              </div>
            ) : pedidos.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-10 h-10 mx-auto text-gray-400 mb-3" />
                <p className="text-gray-500">Aún no has realizado ningún pedido</p>
                <Link 
                  href="/productos" 
                  className="mt-4 inline-block px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                >
                  Explorar productos
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {pedidos.map((pedido) => (
                  <div key={pedido.id} className="border border-gray-200 rounded-lg p-4 hover:bg-purple-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">Pedido #{pedido.id}</h3>
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3" />
                          {new Date(pedido.fecha).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        pedido.estado === 'Entregado' 
                          ? 'bg-green-100 text-green-800' 
                          : pedido.estado === 'Cancelado'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {pedido.estado}
                      </span>
                    </div>
                    <div className="mt-3 flex justify-between items-center">
                      <p className="text-sm">Total: <span className="font-medium">${pedido.total.toLocaleString('es-ES')}</span></p>
                      <Link 
                        href={`/pedidos/${pedido.id}`} 
                        className="text-sm text-purple-600 hover:text-purple-800"
                      >
                        Ver detalles
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}