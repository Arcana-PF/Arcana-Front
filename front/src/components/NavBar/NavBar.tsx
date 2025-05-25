"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, User, Menu } from "lucide-react"

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

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

        {/* Links */}
        <div className="hidden md:flex space-x-6">
          <Link href="/products" className="text-white/80 hover:text-white transition duration-200">Productos</Link>
          <Link href="/categories" className="text-white/80 hover:text-white transition duration-200">Categorías</Link>
          <Link href="/about" className="text-white/80 hover:text-white transition duration-200">Nosotros</Link>
          <Link href="/contact" className="text-white/80 hover:text-white transition duration-200">Contacto</Link>
        </div>

        {/* Iconos usuario */}
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/cart" className="hover:text-white transition duration-200">
            <ShoppingCart className="w-6 h-6" />
          </Link>
          <Link href="/login" className="hover:text-white transition duration-200">
            <User className="w-6 h-6" />
          </Link>
        </div>

        {/* Menu para smartphone*/}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Menu className="w-8 h-8" />
        </button>
      </div>

      {/* Menu hambur para Smartphones */}
      {menuOpen && (
        <div className="md:hidden bg-purple-900 text-white px-4 py-4 space-y-4">
          <Link href="/products" onClick={() => setMenuOpen(false)} className="block py-2">Productos</Link>
          <Link href="/categories" onClick={() => setMenuOpen(false)} className="block py-2">Categorías</Link>
          <Link href="/about" onClick={() => setMenuOpen(false)} className="block py-2">Nosotros</Link>
          <Link href="/contact" onClick={() => setMenuOpen(false)} className="block py-2">Contacto</Link>
          <div className="flex space-x-4 pt-4">
            <Link href="/cart" onClick={() => setMenuOpen(false)}><ShoppingCart className="w-5 h-5" /></Link>
            <Link href="/login" onClick={() => setMenuOpen(false)}><User className="w-5 h-5" /></Link>
          </div>
        </div>
      )}

    </nav>
  )
}
