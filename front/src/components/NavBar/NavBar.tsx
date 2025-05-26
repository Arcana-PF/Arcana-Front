"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, User as UserIcon, Menu, LogOut } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleCartClick = () => {
    if (user) {
      router.push("/cart")
    } else {
      router.push("/login")
    }
  }

  return (
    <nav className="bg-purple-800 text-white w-full sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-24">

        {/* Logo */}
        <Link href="/" className="flex items-center">
          <div className="relative w-32 h-32">
            <Image
              src="/arcanaLogo2.png"
              alt="Logo Arcana"
              fill
              className="object-contain"
            />
          </div>
        </Link>

        {/* Links desktop */}
        <div className="hidden md:flex space-x-6">
          <Link href="/products" className="text-white/80 hover:text-white transition duration-200">Productos</Link>
          <Link href="/categories" className="text-white/80 hover:text-white transition duration-200">Categorías</Link>
          <Link href="/about" className="text-white/80 hover:text-white transition duration-200">Nosotros</Link>
          <Link href="/contact" className="text-white/80 hover:text-white transition duration-200">Contacto</Link>
        </div>

        {/* Iconos usuario desktop */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Carrito protegido */}
          <button onClick={handleCartClick} className="hover:text-white transition duration-200" aria-label="Carrito">
            <ShoppingCart className="w-6 h-6" />
          </button>

          {user ? (
            <>
              <div className="flex items-center space-x-1">
                <Link 
        href="/profile"
        className="flex items-center space-x-1 hover:text-purple-300 transition-colors" 
      >
        <UserIcon className="w-5 h-5" />
        <span className="text-sm">{user.name}</span>
      </Link>
              </div>
              <button onClick={handleLogout} className="hover:text-red-400 transition duration-200" aria-label="Cerrar sesión">
                <LogOut className="w-6 h-6" />
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm hover:text-white transition duration-200">
                Login
              </Link>
              <Link href="/register" className="text-sm hover:text-white transition duration-200">
                Registrarse
              </Link>
            </>
          )}
        </div>

        {/* Botón menú mobile */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menú"
        >
          <Menu className="w-8 h-8" />
        </button>
      </div>

      {/* Menú hamburguesa para móviles */}
      {menuOpen && (
        <div className="md:hidden bg-purple-900 text-white px-4 py-4 space-y-4">
          <Link href="/products" onClick={() => setMenuOpen(false)} className="block py-2">Productos</Link>
          <Link href="/categories" onClick={() => setMenuOpen(false)} className="block py-2">Categorías</Link>
          <Link href="/about" onClick={() => setMenuOpen(false)} className="block py-2">Nosotros</Link>
          <Link href="/contact" onClick={() => setMenuOpen(false)} className="block py-2">Contacto</Link>
          <div className="flex space-x-4 pt-4 items-center">
            {/* Carrito protegido mobile */}
            <button onClick={() => {
              handleCartClick()
              setMenuOpen(false)
            }}>
              <ShoppingCart className="w-5 h-5" />
            </button>

            {user ? (
              <>
                <div className="flex items-center space-x-1">
                
                  <UserIcon className="w-4 h-4" />
                  <span className="text-sm">{user.name}</span>
                </div>
                <button
                  onClick={() => {
                    handleLogout()
                    setMenuOpen(false)
                  }}
                  aria-label="Cerrar sesión"
                >
                  <LogOut className="w-5 h-5 text-red-300" />
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMenuOpen(false)} className="text-sm">
                  Login
                </Link>
                <Link href="/register" onClick={() => setMenuOpen(false)} className="text-sm">
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
