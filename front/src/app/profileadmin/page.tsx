"use client"
import React, { useState } from 'react';
import PerfilAdmin from '@/components/ProfileAdmin/ProfileAdmincomponent';
import ProductForm from '@/components/Adminproduct/AdminProduct';
import AdminRoleAssigner from '@/components/Adminproduct/AdminRoles';

const ProfileAdmin = () => {
  const [activeSection, setActiveSection] = useState<'products' | 'users'>('products');

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-900 via-purple-800 to-black py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Panel Principal (Perfil) - Siempre visible arriba */}
        <div className="bg-black/80 backdrop-blur-sm rounded-xl border border-yellow-500/20 p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">Mi Perfil Administrador</h2>
          <PerfilAdmin />
        </div>

        {/* Panel de Control Secundario */}
        <div className="bg-black/80 backdrop-blur-sm rounded-xl border border-yellow-500/20 p-6 shadow-lg">
          {/* Selector de Secciones */}
          <div className="flex border-b border-yellow-500/20 mb-6">
            <button
              onClick={() => setActiveSection('products')}
              className={`px-4 py-2 font-medium cursor-pointer ${
                activeSection === 'products'
                  ? 'text-yellow-400 border-b-2 border-yellow-400'
                  : 'text-gray-400 hover:text-yellow-300'
              }`}
            >
              Gestión de Productos
            </button>
            <button
              onClick={() => setActiveSection('users')}
              className={`px-4 py-2 font-medium cursor-pointer ${
                activeSection === 'users'
                  ? 'text-yellow-400 border-b-2 border-yellow-400'
                  : 'text-gray-400 hover:text-yellow-300'
              }`}
            >
              Administración de Usuarios
            </button>
          </div>

          {/* Contenido de las Secciones */}
          <div className="min-h-[400px]">
            {activeSection === 'products' && (
              <div className="animate-fadeIn">
                <ProductForm />
              </div>
            )}

            {activeSection === 'users' && (
              <div className="animate-fadeIn">
                <AdminRoleAssigner />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Estilos globales para las animaciones */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ProfileAdmin;