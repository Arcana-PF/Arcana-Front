"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/context/AuthContext"
import { getProductsDB } from "@/utils/product.helper"
import type { IProduct } from "@/types"
import { Search, ShoppingCart, UserIcon, Menu, LogOut, Sparkles, UserPlus, X } from "lucide-react"
import { useRouter } from "next/navigation"
import Swal from "sweetalert2"

export default function Navbar() {
  const { userData, setUserData } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [showResults, setShowResults] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  // Estado para almacenar todos los productos
  const [allProducts, setAllProducts] = useState<IProduct[]>([])
  const [loadingProducts, setLoadingProducts] = useState(false)

  // Cargar los productos desde el helper al montar el componente
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoadingProducts(true)
        const products = await getProductsDB()
        setAllProducts(products)
      } catch (error: any) {
        console.error("Error fetching products:", error)
      } finally {
        setLoadingProducts(false)
      }
    }
    fetchProducts()
  }, [])

  // Cerrar resultados al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Filtrar productos en base al término de búsqueda
  const filteredProducts = allProducts.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleLogout = () => {
    Swal.fire({
      title: "¿Abandonar el Círculo?",
      text: "¿Estás seguro de que deseas cerrar tu conexión mística?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, abandonar",
      cancelButtonText: "No, permanecer",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#7c3aed",
      background: "#0e0a1f",
      color: "#e5e7eb",
    }).then((result) => {
      if (result.isConfirmed) {
        setUserData(null)
        localStorage.removeItem("userSession")

        Swal.fire({
          title: "Conexión cerrada",
          text: "Has abandonado el Círculo Arcano. Regresa pronto.",
          icon: "info",
          confirmButtonColor: "#facc15",
          background: "#0e0a1f",
          color: "#e5e7eb",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        }).then(() => {
          router.push("/")
        })
      }
    })
  }

  const handleCartClick = () => {
    router.push("/cart")
  }

  return (
    <nav className="bg-gradient-to-r from-purple-900 via-purple-800 to-purple-900 text-white w-full sticky top-0 z-50 shadow-2xl border-b border-yellow-500/20">
      {/* Efectos de fondo decorativos */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-yellow-500/5 rounded-full blur-2xl"></div>
        <div className="absolute top-0 right-1/4 w-24 h-24 bg-purple-500/5 rounded-full blur-xl"></div>
      </div>

      <div className="container mx-auto px-4 py-4 relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="relative w-12 h-12 transition-transform duration-300 group-hover:scale-110">
              <Image src="/arcanaLogo2.png" alt="Logo Arcana" fill className="object-contain" />
            </div>
            <div className="ml-3">
              <h1 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                Círculo Arcano
              </h1>
            </div>
          </Link>

          {/* Barra de búsqueda - Desktop */}
          <div className="hidden md:block flex-1 max-w-2xl mx-8" ref={searchRef}>
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar elementos arcanos..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setShowResults(true)
                  }}
                  onFocus={() => setShowResults(true)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-black/50 backdrop-blur-sm text-white placeholder-gray-400 border border-yellow-500/30 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-200"
                />
                {searchTerm && (
                  <button
                    onClick={() => {
                      setSearchTerm("")
                      setShowResults(false)
                    }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-yellow-400 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Resultados de búsqueda */}
              {showResults && searchTerm.trim() !== "" && (
                <div className="absolute left-0 right-0 bg-black/90 backdrop-blur-sm border border-yellow-500/30 rounded-xl mt-2 shadow-2xl z-20 max-h-80 overflow-y-auto">
                  {loadingProducts ? (
                    <div className="p-6 text-center">
                      <div className="flex items-center justify-center text-yellow-500">
                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-yellow-500 mr-3"></div>
                        <span>Consultando el grimorio...</span>
                      </div>
                    </div>
                  ) : filteredProducts.length > 0 ? (
                    <div className="p-2">
                      {filteredProducts.slice(0, 8).map((product) => (
                        <Link href={`/product/${product.id}`} key={product.id}>
                          <div
                            className="flex items-center p-3 hover:bg-yellow-500/10 rounded-lg cursor-pointer transition-all duration-200 border-b border-yellow-500/10 last:border-b-0"
                            onClick={() => {
                              setShowResults(false)
                              setSearchTerm("")
                            }}
                          >
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-yellow-500/30 mr-3">
                              <Image
                                src={product.imgUrl || "/placeholder.svg?height=48&width=48"}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-white">{product.name}</p>
                              <p className="text-yellow-500 font-medium">${product.price.toLocaleString("es-ES")}</p>
                              <p className="text-xs text-gray-400 truncate max-w-xs">
                                {product.description.substring(0, 60)}...
                              </p>
                            </div>
                            <Sparkles className="w-4 h-4 text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </Link>
                      ))}
                      {filteredProducts.length > 8 && (
                        <div className="p-3 text-center border-t border-yellow-500/20">
                          <p className="text-gray-400 text-sm">Y {filteredProducts.length - 8} elementos más...</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-6 text-center">
                      <Search className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-400">No se encontraron elementos arcanos.</p>
                      <p className="text-gray-500 text-sm mt-1">Intenta con otro término de búsqueda</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Iconos de usuario y carrito - Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            {userData ? (
              <>
                {/* Carrito - solo si hay sesión activa */}
                <button
                  onClick={handleCartClick}
                  className="relative hover:text-yellow-400 transition duration-300 cursor-pointer group"
                  aria-label="Carrito Arcano"
                >
                  <ShoppingCart className="w-6 h-6" />
                  {/* Badge del carrito (opcional) */}
                  <span className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    0
                  </span>
                </button>

                {/* Perfil del usuario */}
                <Link
                  href="/profile"
                  className="flex items-center space-x-2 hover:text-yellow-400 transition-colors group"
                >
                  <UserIcon className="w-5 h-5" />
                  <span className="text-sm font-medium">{userData?.user?.name}</span>
                  <Sparkles className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>

                {/* Cerrar sesión */}
                <button
                  onClick={handleLogout}
                  className="hover:text-red-400 transition duration-300 cursor-pointer"
                  aria-label="Abandonar Círculo"
                >
                  <LogOut className="w-6 h-6" />
                </button>
              </>
            ) : (
              <>
                {/* Botones cuando NO hay sesión */}
                <Link
                  href="/login"
                  className="text-sm hover:text-yellow-400 transition duration-300 font-medium px-3 py-2 rounded-lg hover:bg-white/10"
                >
                  Acceso Arcano
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-2 text-sm bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-4 py-2 rounded-lg font-semibold hover:from-yellow-400 hover:to-yellow-500 transition duration-300"
                >
                  <UserPlus className="w-4 h-4" />
                  Unirse al Círculo
                </Link>
              </>
            )}
          </div>

          {/* Botón menú mobile */}
          <button
            className="md:hidden hover:text-yellow-400 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menú"
          >
            <Menu className="w-8 h-8" />
          </button>
        </div>

        {/* Barra de búsqueda - Mobile */}
        <div className="md:hidden mt-4" ref={searchRef}>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar elementos arcanos..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setShowResults(true)
              }}
              onFocus={() => setShowResults(true)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-black/50 backdrop-blur-sm text-white placeholder-gray-400 border border-yellow-500/30 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-200"
            />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm("")
                  setShowResults(false)
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-yellow-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Resultados de búsqueda mobile */}
          {showResults && searchTerm.trim() !== "" && (
            <div className="absolute left-4 right-4 bg-black/90 backdrop-blur-sm border border-yellow-500/30 rounded-xl mt-2 shadow-2xl z-20 max-h-80 overflow-y-auto">
              {loadingProducts ? (
                <div className="p-6 text-center">
                  <div className="flex items-center justify-center text-yellow-500">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-yellow-500 mr-3"></div>
                    <span>Consultando el grimorio...</span>
                  </div>
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className="p-2">
                  {filteredProducts.slice(0, 6).map((product) => (
                    <Link href={`/product/${product.id}`} key={product.id}>
                      <div
                        className="flex items-center p-3 hover:bg-yellow-500/10 rounded-lg cursor-pointer transition-all duration-200 border-b border-yellow-500/10 last:border-b-0"
                        onClick={() => {
                          setShowResults(false)
                          setSearchTerm("")
                          setMenuOpen(false)
                        }}
                      >
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-yellow-500/30 mr-3">
                          <Image
                            src={product.imgUrl || "/placeholder.svg?height=40&width=40"}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-white text-sm">{product.name}</p>
                          <p className="text-yellow-500 font-medium text-sm">
                            ${product.price.toLocaleString("es-ES")}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center">
                  <Search className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-400">No se encontraron elementos.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Menú hamburguesa para móviles */}
        {menuOpen && (
          <div className="md:hidden bg-purple-900/95 backdrop-blur-sm text-white px-4 py-6 space-y-4 border-t border-yellow-500/20 mt-4 rounded-xl">
            <div className="flex flex-col space-y-4">
              {userData ? (
                <>
                  {/* Carrito protegido mobile */}
                  <button
                    onClick={() => {
                      handleCartClick()
                      setMenuOpen(false)
                    }}
                    className="flex items-center space-x-2 hover:text-yellow-400 transition-colors py-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Carrito Arcano</span>
                  </button>

                  {/* Perfil mobile */}
                  <Link
                    href="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center space-x-2 hover:text-yellow-400 transition-colors py-2"
                  >
                    <UserIcon className="w-5 h-5" />
                    <span className="text-sm font-medium">{userData?.user?.name}</span>
                  </Link>

                  {/* Cerrar sesión mobile */}
                  <button
                    onClick={() => {
                      handleLogout()
                      setMenuOpen(false)
                    }}
                    className="flex items-center space-x-2 hover:text-red-400 transition-colors py-2"
                    aria-label="Abandonar Círculo"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Abandonar Círculo</span>
                  </button>
                </>
              ) : (
                <>
                  {/* Botones mobile cuando NO hay sesión */}
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="text-sm hover:text-yellow-400 transition-colors font-medium py-2"
                  >
                    Acceso Arcano
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 text-sm bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-4 py-2 rounded-lg font-semibold hover:from-yellow-400 hover:to-yellow-500 transition duration-300 text-center"
                  >
                    <UserPlus className="w-4 h-4" />
                    Unirse al Círculo
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
