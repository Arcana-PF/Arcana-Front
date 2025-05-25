"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-purple-900 via-indigo-900 to-black shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo / Marca */}
        <Link href="/">
          <span className="text-3xl font-bold text-white tracking-widest hover:text-yellow-300 transition-colors duration-300">
            ✨ ARKANA
          </span>
        </Link>

        {/* Navegación */}
        <div className="hidden md:flex space-x-8 text-white text-sm md:text-base">
          <Link href="/products" className="hover:text-yellow-300 transition-colors">Productos</Link>
          <Link href="/categories" className="hover:text-yellow-300 transition-colors">Categorías</Link>
          <Link href="/about" className="hover:text-yellow-300 transition-colors">Nosotros</Link>
          <Link href="/contact" className="hover:text-yellow-300 transition-colors">Contacto</Link>
        </div>

        {/* Botones futuros (carrito, login) */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Placeholder para iconos futuros */}
          <button className="text-white hover:text-yellow-300 transition-colors">🛒</button>
          <button className="text-white hover:text-yellow-300 transition-colors">Iniciar sesión</button>
        </div>
      </div>
    </nav>
  );
}
