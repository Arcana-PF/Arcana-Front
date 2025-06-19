"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import Link from "next/link"
import { useCart } from "@/context/CartContext"
import { useAuth } from "@/context/AuthContext"
import { getProductsDB } from "@/utils/product.helper"
import type { IProduct } from "@/types"
import { Search, ShoppingCart, UserIcon, Menu, LogOut, UserPlus, X, ChevronDown } from "lucide-react"
import { useRouter } from "next/navigation"
import Swal from "sweetalert2"
import Cookies from "js-cookie"

export default function Navbar() {
  const { userData, setUserData } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [showResults, setShowResults] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [categoriesOpen, setCategoriesOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const categoriesRef = useRef<HTMLDivElement>(null)
  const [allProducts, setAllProducts] = useState<IProduct[]>([])
  const [loadingProducts, setLoadingProducts] = useState(false)
  const { cart, isCartReady, refreshCart } = useCart()

  // Categorías disponibles
  const categories = [
    { name: "Todos", label: "Todos los Productos" },
    { name: "Amuletos", label: "Amuletos" },
    { name: "Tarot", label: "Tarot & Oráculos" },
    { name: "Cristales", label: "Cristales & Gemas" },
    { name: "Inciensos", label: "Inciensos" },
    { name: "Sahumerios", label: "Sahumerios" },
    { name: "Velas", label: "Velas Rituales" },
    { name: "Libros", label: "Libros Místicos" },
    { name: "Estatuillas", label: "Estatuillas" },
    { name: "Quemantes", label: "Quemantes" },
    { name: "Specials", label: "Specials" },
  ]

  // contador dinámico, solo cuando el carrito ya cargó y no es admin
  const itemCount = useMemo(() => {
    if (!isCartReady || !userData?.user?.id || userData.user.isAdmin) {
      return 0
    }
    return cart.items.length
  }, [isCartReady, userData?.user?.id, userData?.user?.isAdmin, cart.items.length])

  // Debug effect - puedes remover esto después de verificar que funciona
  useEffect(() => {
    console.log("🛒 NavBar - Cart Status:", {
      isCartReady,
      userLoggedIn: !!userData?.user?.id,
      userId: userData?.user?.id,
      isAdmin: userData?.user?.isAdmin,
      itemCount,
      cartItemsLength: cart.items.length,
      cartItems: cart.items.map((item) => ({ id: item.id, name: item.product.name, quantity: item.quantity })),
    })
  }, [isCartReady, userData?.user?.id, userData?.user?.isAdmin, itemCount, cart.items])

  // Efecto para refrescar el carrito cuando el componente se monta
  useEffect(() => {
    if (userData?.user?.id && !userData.user.isAdmin && refreshCart) {
      console.log("🔄 Refreshing cart for user:", userData.user.id)
      refreshCart()
    }
  }, [userData?.user?.id, userData?.user?.isAdmin, refreshCart])

  // Efecto para escuchar cambios en el carrito
  useEffect(() => {
    const handleCartUpdate = () => {
      console.log("📢 Cart update event received")
      if (refreshCart) {
        refreshCart()
      }
    }

    // Escuchar evento personalizado para actualizaciones del carrito
    window.addEventListener("cartUpdated", handleCartUpdate)

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate)
    }
  }, [refreshCart])

  // Cargar los productos desde el helper al montar el componente
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoadingProducts(true)
        const products = await getProductsDB()
        setAllProducts(products)
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Error fetching products:", error.message)
        } else {
          console.error("Error desconocido al obtener productos:", error)
        }
      } finally {
        setLoadingProducts(false)
      }
    }
    fetchProducts()
  }, [])

  // Cerrar dropdowns al hacer click fuera
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowResults(false)
        setCategoriesOpen(false)
      }
    }

    document.addEventListener("pointerdown", handleClickOutside)
    return () => {
      document.removeEventListener("pointerdown", handleClickOutside)
    }
  }, [])

  // Filtrar productos según el término de búsqueda
  const filteredProducts = allProducts.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Manejar navegación a categoría
  const handleCategoryClick = (categoryName: string) => {
    setCategoriesOpen(false)
    setMenuOpen(false)

    if (categoryName === "Todos") {
      router.push("/products")
    } else {
      router.push(`/products?category=${encodeURIComponent(categoryName)}`)
    }
  }

  // Manejar el cierre de sesión con confirmación
  const handleLogout = async () => {
    const { isConfirmed } = await Swal.fire({
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
      allowOutsideClick: false,
      backdrop: `
      rgba(14, 10, 31, 0.8)
      url("/images/magic-sparkles.gif")
      center top
      no-repeat
    `,
    })

    if (isConfirmed) {
      try {
        //  Limpiar el estado del frontend
        setUserData(null)

        // Eliminar datos del localStorage
        localStorage.removeItem("userSession")
        localStorage.removeItem("cart")
        // Borrar todas las cookies accesibles

        Cookies.remove("userSession")

        await Swal.fire({
          title: "Conexión cerrada",
          text: "Has abandonado el Círculo Arcano. Los portales se cerrarán...",
          icon: "success",
          confirmButtonColor: "#facc15",
          background: "#0e0a1f",
          color: "#e5e7eb",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
          willClose: () => {
            //Redireccionar después de cerrar
            router.push("/")
            router.refresh() // Para asegurar que se actualicen los datos
          },
        })
      } catch (error) {
        console.error("Error en el ritual de cierre:", error)
        await Swal.fire({
          title: "¡Protecciones místicas activas!",
          text: "El cierre de sesión no se completó completamente. Por favor, intenta nuevamente.",
          icon: "error",
          confirmButtonColor: "#7c3aed",
          background: "#0e0a1f",
          color: "#e5e7eb",
        })
      }
    }
  }

  const handleCartClick = () => {
    router.push("/cart")
  }

  return (
    <nav className="bg-gradient-to-r from-purple-900 via-purple-800 to-purple-900 text-white w-full sticky top-0 z-50 shadow-lg border-b border-yellow-500/20">
      <div className="container mx-auto px-4 py-2" ref={containerRef}>
        {/* Primera fila - Logo, búsqueda y acciones */}
        <div className="flex items-center justify-between py-2">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="relative w-42 h-30">
              <img src="/arcanaLogo2.png" alt="Logo Arcana" className="object-contain" />
            </div>
          </Link>

          {/* Barra de búsqueda - Desktop */}
          <div className="hidden lg:block flex-1 max-w-xl mx-8" ref={searchRef}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar elementos arcanos..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setShowResults(true)
                }}
                onFocus={() => setShowResults(true)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-black/30 text-white placeholder-gray-400 border border-yellow-500/30 focus:outline-none focus:border-yellow-400 transition-all duration-200"
              />
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm("")
                    setShowResults(false)
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-yellow-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Acciones de usuario */}
          <div className="flex items-center space-x-4">
            {userData ? (
              <>
                {/* Solo mostrar carrito si NO es admin */}
                {!userData.user.isAdmin && (
                  <button
                    onClick={handleCartClick}
                    className="p-2 hover:text-yellow-400 transition-colors relative cursor-pointer"
                    aria-label={`Carrito (${itemCount} items)`}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {itemCount > 0 && (
                      <span
                        className="
                          absolute -top-1 -right-1
                          bg-yellow-500 text-black text-xs
                          rounded-full w-4 h-4
                          flex items-center justify-center
                          animate-pulse
                          font-bold
                        "
                        key={`cart-${itemCount}`}
                      >
                        {itemCount}
                      </span>
                    )}
                  </button>
                )}

                <Link
                  href={Boolean(userData?.user?.isAdmin) ? "/profileadmin" : "/profile"}
                  className="p-2 hover:text-yellow-400 transition-colors"
                >
                  <UserIcon className="w-5 h-5" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 hover:text-red-400 transition-colors cursor-pointer"
                  aria-label="Cerrar sesión"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden md:block text-sm hover:text-yellow-400 transition-colors px-3 py-1"
                >
                  Ingresar
                </Link>
                <Link
                  href="/register"
                  className="hidden md:flex items-center gap-1 text-sm bg-yellow-500 text-black px-3 py-1 rounded-md font-medium hover:bg-yellow-400 transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Registrarse</span>
                </Link>
              </>
            )}
            <button
              className="lg:hidden p-2 hover:text-yellow-400 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menú"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Segunda fila - Navegación principal */}
        <div className="hidden lg:flex justify-center py-2 border-t border-yellow-500/20">
          <div className="flex space-x-6">
            <Link href="/products" className="text-sm font-medium hover:text-yellow-400 transition-colors py-1">
              Todos los Productos
            </Link>

            {/* Dropdown de Categorías */}
            <div className="relative" ref={categoriesRef}>
              <button
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                className="flex items-center text-sm font-medium hover:text-yellow-400 transition-colors py-1 gap-1"
              >
                Categorías
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${categoriesOpen ? "rotate-180" : ""}`}
                />
              </button>

              {categoriesOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-purple-900/95 backdrop-blur-sm border border-yellow-500/30 rounded-lg shadow-lg z-30">
                  <div className="py-2">
                    {categories.map((category) => (
                      <button
                        key={category.name}
                        onClick={() => handleCategoryClick(category.name)}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-yellow-500/10 hover:text-yellow-400 transition-colors"
                      >
                        {category.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link href="/about" className="text-sm font-medium hover:text-yellow-400 transition-colors py-1">
              Sobre Nosotros
            </Link>
            <Link href="/contact" className="text-sm font-medium hover:text-yellow-400 transition-colors py-1">
              Contacto
            </Link>
          </div>
        </div>

        {/* Barra de búsqueda - Mobile */}
        <div className="lg:hidden mt-2 mb-2" ref={searchRef}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setShowResults(true)
              }}
              onFocus={() => setShowResults(true)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-black/30 text-white placeholder-gray-400 border border-yellow-500/30 focus:outline-none focus:border-yellow-400 transition-all duration-200"
            />
          </div>
        </div>

        {/* Menú móvil */}
        {menuOpen && (
          <div className="lg:hidden bg-purple-800/95 backdrop-blur-sm rounded-lg shadow-lg mt-2 mb-4 py-3">
            <div className="flex flex-col space-y-1 px-4">
              <Link
                href="/products"
                onClick={() => setMenuOpen(false)}
                className="py-2 hover:text-yellow-400 transition-colors border-b border-yellow-500/10"
              >
                Productos
              </Link>

              {/* Categorías en móvil */}
              <div className="border-b border-yellow-500/10">
                <button
                  onClick={() => setCategoriesOpen(!categoriesOpen)}
                  className="w-full text-left py-2 hover:text-yellow-400 transition-colors flex items-center justify-between"
                >
                  Categorías
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${categoriesOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {categoriesOpen && (
                  <div className="pl-4 pb-2">
                    {categories.map((category) => (
                      <button
                        key={category.name}
                        onClick={() => handleCategoryClick(category.name)}
                        className="block w-full text-left py-1 text-sm text-purple-200 hover:text-yellow-400 transition-colors"
                      >
                        {category.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <Link
                href="/about"
                onClick={() => setMenuOpen(false)}
                className="py-2 hover:text-yellow-400 transition-colors border-b border-yellow-500/10"
              >
                Sobre Nosotros
              </Link>
              <Link
                href="/contact"
                onClick={() => setMenuOpen(false)}
                className="py-2 hover:text-yellow-400 transition-colors border-b border-yellow-500/10"
              >
                Contacto
              </Link>

              {userData ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="py-2 hover:text-yellow-400 transition-colors border-b border-yellow-500/10 flex items-center gap-2"
                  >
                    <UserIcon className="w-4 h-4" />
                    Mi Perfil
                  </Link>

                  {userData && !userData.user.isAdmin && (
                    <button
                      onClick={() => {
                        handleCartClick()
                        setMenuOpen(false)
                      }}
                      className="py-2 hover:text-yellow-400 transition-colors border-b border-yellow-500/10 flex items-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Carrito</span>
                      {itemCount > 0 && (
                        <span
                          className="ml-auto bg-yellow-500 text-black text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse font-bold"
                          key={`mobile-cart-${itemCount}`}
                        >
                          {itemCount}
                        </span>
                      )}
                    </button>
                  )}

                  <button
                    onClick={() => {
                      handleLogout()
                      setMenuOpen(false)
                    }}
                    className="py-2 hover:text-red-400 transition-colors flex items-center gap-2 text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="py-2 hover:text-yellow-400 transition-colors border-b border-yellow-500/10"
                  >
                    Ingresar
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMenuOpen(false)}
                    className="py-2 text-yellow-400 font-medium flex items-center gap-1"
                  >
                    <UserPlus className="w-4 h-4" />
                    Crear Cuenta
                  </Link>
                </>
              )}
            </div>
          </div>
        )}

        {/* Resultados de búsqueda */}
        {showResults && searchTerm.trim() !== "" && (
          <div className="absolute left-0 right-0 mx-4 bg-purple-900/95 backdrop-blur-sm border border-yellow-500/30 rounded-lg shadow-lg z-20 max-h-80 overflow-y-auto">
            {loadingProducts ? (
              <div className="p-4 text-center">
                <div className="flex items-center justify-center text-yellow-500">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-yellow-500 mr-2"></div>
                  <span className="text-sm">Buscando en el grimorio...</span>
                </div>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="divide-y divide-yellow-500/10">
                {filteredProducts.slice(0, 5).map((product) => (
                  <Link href={`/products/${product.id}`} key={product.id}>
                    <div
                      className="flex items-center p-3 hover:bg-yellow-500/10 cursor-pointer transition-colors"
                      onClick={() => {
                        setShowResults(false)
                        setSearchTerm("")
                        setMenuOpen(false)
                      }}
                    >
                      <div className="relative w-10 h-10 rounded-md overflow-hidden border border-yellow-500/30 mr-3">
                        <img src={product.imgUrl || "/placeholder.svg"} alt={product.name} className="object-cover" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{product.name}</p>
                        <p className="text-xs text-yellow-400">${product.price.toLocaleString()}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-sm text-gray-300">No se encontraron productos</div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
