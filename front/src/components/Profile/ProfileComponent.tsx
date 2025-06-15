"use client"
import { useAuth } from "@/context/AuthContext"
import { User, MapPin, Edit, Phone, Sparkles } from "lucide-react"
import Link from "next/link"

const PerfilUsuario = () => {
  const { userData } = useAuth()

  if (!userData) {
    return <div>Cargando...</div>; // Puedes mostrar un spinner o mensaje de carga
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-black py-8 px-4">
      {/* Efectos de fondo decorativos */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Encabezado */}
        <div className="flex items-center mb-8">
          <Sparkles className="w-8 h-8 text-yellow-500 mr-3 animate-pulse" />
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            Mi Perfil Arcano
          </h1>
        </div>

        {/* Tarjeta de información personal */}
        <div className="bg-black/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-yellow-500/30 overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center">
                <div className="bg-yellow-500/20 p-3 rounded-full mr-4 border border-yellow-500/30">
                  <User className="w-6 h-6 text-yellow-500" />
                </div>
                <h2 className="text-xl font-semibold text-white">Información del Iniciado</h2>
              </div>
              <Link
                href="/profile/edit"
                className="flex items-center gap-2 text-sm text-yellow-500 hover:text-yellow-400 transition-colors bg-yellow-500/10 px-3 py-2 rounded-lg border border-yellow-500/30 hover:border-yellow-500/50"
              >
                <Edit className="w-4 h-4" />
                Editar
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-900/50 p-4 rounded-xl border border-yellow-500/20">
                <h3 className="text-xs font-medium text-yellow-500 mb-2 uppercase tracking-wide">Nombre Arcano</h3>
                <p className="font-medium text-white text-lg">{userData?.user?.name}</p>
              </div>

              <div className="bg-gray-900/50 p-4 rounded-xl border border-yellow-500/20">
                <h3 className="text-xs font-medium text-yellow-500 mb-2 uppercase tracking-wide">Email Místico</h3>
                <p className="font-medium text-white text-lg">{userData?.user?.email}</p>
              </div>

              <div className="bg-gray-900/50 p-4 rounded-xl border border-yellow-500/20">
                <h3 className="text-xs font-medium text-yellow-500 mb-2 uppercase tracking-wide">
                  Comunicación Astral
                </h3>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-yellow-500" />
                  <p className="font-medium text-white">{userData?.user?.phone || "No especificado"}</p>
                </div>
              </div>

              <div className="bg-gray-900/50 p-4 rounded-xl border border-yellow-500/20">
                <h3 className="text-xs font-medium text-yellow-500 mb-2 uppercase tracking-wide">
                  Ubicación en el Plano Físico
                </h3>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-yellow-500" />
                  <p className="font-medium text-white">{userData?.user?.address || "No especificada"}</p>
                </div>
              </div>
            </div>

            {/* Botón de órdenes arcano */}
            <div className="mt-6 flex justify-center">
              <Link
                href="/profile/orders"
                className="inline-block text-center text-yellow-500 font-semibold bg-yellow-500/20 px-4 py-2 rounded-lg border border-yellow-500/30 hover:bg-yellow-500/30 hover:text-yellow-400 transition-all duration-300 shadow-md"
              >
                ✦ Ver Órdenes ✦
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default PerfilUsuario
