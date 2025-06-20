"use client";

import Link from "next/link";
import { Mail, Lock, HelpCircle, BookOpen } from "lucide-react";
import FooterModal from "./FooterModal";
import { useState } from "react";

export default function Footer() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<number | null>(null);

  const openModal = (tabIndex: number) => {
    setSelectedTab(tabIndex);
    setIsModalOpen(true);
  };

  return (
    <footer className="bg-gradient-to-b from-purple-800 to-purple-900 text-white w-full py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          {/* Logo */}
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
              <h3 className="text-purple-300 font-medium text-sm uppercase tracking-wider mb-2 cursor-pointer">Información</h3>
              <button
                onClick={() => openModal(0)}
                className="flex items-center gap-2 text-purple-100 hover:text-white transition-colors text-sm cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                Privacidad
              </button>
              <button
                onClick={() => openModal(2)}
                className="flex items-center gap-2 text-purple-100 hover:text-white transition-colors text-sm cursor-pointer"
              >
                <HelpCircle className="w-4 h-4" />
                Términos de servicio
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="text-purple-300 font-medium text-sm uppercase tracking-wider mb-2 cursor-pointer">Contacto</h3>
              <Link
                href="/contact"
                className="flex items-center gap-2 text-purple-100 hover:text-white transition-colors text-sm cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                Contáctanos
              </Link>
              <button
                onClick={() => openModal(1)}
                className="flex items-center gap-2 text-purple-100 hover:text-white transition-colors text-sm cursor-pointer"
              >
                <HelpCircle className="w-4 h-4" />
                Preguntas Frecuentes
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-purple-700/50 my-6" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-purple-300/80">
            © {new Date().getFullYear()} ArCana. Todos los derechos reservados.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => openModal(2)}
              className="text-xs text-purple-300/80 hover:text-white transition-colors cursor-pointer"
            >
              Términos de servicio
            </button>
            <button
              onClick={() => openModal(3)}
              className="text-xs text-purple-300/80 hover:text-white transition-colors cursor-pointer"
            >
              Envíos y devoluciones
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedTab !== null && (
        <FooterModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialTab={selectedTab}


              />
            )}
    </footer>
  );
}
