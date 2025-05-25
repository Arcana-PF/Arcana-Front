"use client";

import Link from "next/link";
import { Mail, Lock, HelpCircle, BookOpen } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-purple-800 to-purple-900 text-white w-full py-10">
      <div className="max-w-6xl mx-auto px-4">
        {/* Contenido principal */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          
          {/* Sección Logo y descripción */}
          <div className="max-w-xs">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <BookOpen className="w-6 h-6 text-purple-300" />
              <span className="text-xl font-semibold tracking-tight">ARCANA</span>
            </Link>
            <p className="text-sm text-purple-200">
              Tu destino para productos esotéricos de calidad y herramientas espirituales.
            </p>
          </div>

          {/* Links rápidos */}
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-3">
              <h3 className="text-purple-300 font-medium text-sm uppercase tracking-wider mb-2">Información</h3>
              <Link 
                href="/about" 
                className="flex items-center gap-2 text-purple-100 hover:text-white transition-colors text-sm"
              >
                <HelpCircle className="w-4 h-4" />
                Sobre Nosotros
              </Link>
              <Link 
                href="/privacy" 
                className="flex items-center gap-2 text-purple-100 hover:text-white transition-colors text-sm"
              >
                <Lock className="w-4 h-4" />
                Privacidad
              </Link>
            </div>
            
            <div className="flex flex-col gap-3">
              <h3 className="text-purple-300 font-medium text-sm uppercase tracking-wider mb-2">Contacto</h3>
              <Link 
                href="/contact" 
                className="flex items-center gap-2 text-purple-100 hover:text-white transition-colors text-sm"
              >
                <Mail className="w-4 h-4" />
                Contáctanos
              </Link>
              <Link 
                href="/faq" 
                className="flex items-center gap-2 text-purple-100 hover:text-white transition-colors text-sm"
              >
                <HelpCircle className="w-4 h-4" />
                Preguntas Frecuentes
              </Link>
            </div>
          </div>
        </div>

        {/* División */}
        <div className="border-t border-purple-700/50 my-6"></div>

        {/* Derechos */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-purple-300/80">
            © {new Date().getFullYear()} ArCana. Todos los derechos reservados.
          </p>
          <div className="flex gap-4">
            <Link href="/terms" className="text-xs text-purple-300/80 hover:text-white transition-colors">
              Términos de servicio
            </Link>
            <Link href="/shipping" className="text-xs text-purple-300/80 hover:text-white transition-colors">
              Envíos y devoluciones
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}