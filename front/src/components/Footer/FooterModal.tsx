"use client";

import { useState, useEffect } from "react";
import {
  X,
  Lock,
  HelpCircle,
  FileText,
  Truck,
} from "lucide-react";

const sections = [
  {
    label: "Privacidad",
    icon: <Lock className="w-4 h-4 mr-1 text-purple-600" />,
    content: `En Arcana, tu privacidad es una prioridad. Tus datos están protegidos mediante cifrado seguro y nunca compartimos tu información personal con terceros. Utilizamos cookies solo para mejorar tu experiencia de navegación.`,
  },
  {
    label: "Preguntas Frecuentes",
    icon: <HelpCircle className="w-4 h-4 mr-1 text-purple-600" />,
    content: `¿Hacen envíos internacionales? Sí, a toda Latinoamérica.\n\n¿Puedo devolver un producto? Tenés hasta 30 días desde la entrega. \n\n¿Los productos están consagrados? Algunos sí, lo aclaramos en la descripción.\n\n¿Puedo pagar en cuotas? Sí, aceptamos cuotas según promociones bancarias.`,
  },
  {
    label: "Términos de servicio",
    icon: <FileText className="w-4 h-4 mr-1 text-purple-600" />,
    content: `El uso del sitio implica la aceptación de nuestros términos. Nuestros productos son para uso personal o espiritual. Nos reservamos el derecho de modificar las condiciones sin previo aviso.`,
  },
  {
    label: "Envíos y devoluciones",
    icon: <Truck className="w-4 h-4 mr-1 text-purple-600" />,
    content: `📦 Envíos: Los pedidos se procesan en 24-48hs hábiles. Ofrecemos seguimiento en tiempo real.\n\n🔄 Devoluciones: Aceptadas dentro de los 30 días. El producto debe estar en perfectas condiciones y con su embalaje original.`,
  },
];


export default function FooterModal({
  isOpen,
  onClose,
  initialTab = 0,
}: {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: number;
}) {
  const [activeTab, setActiveTab] = useState(initialTab);

  
  useEffect(() => {
    if (isOpen) setActiveTab(initialTab);
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white text-gray-800 w-full max-w-3xl rounded-xl shadow-2xl border border-purple-300 animate-fadeIn overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-purple-900 to-purple-800 text-white">
          <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2">
            {sections[activeTab].icon}
            {sections[activeTab].label}
          </h2>
          <button
            onClick={onClose}
            className="hover:text-red-300 transition"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap border-b border-gray-200 bg-gray-100 text-sm font-medium text-gray-600">
          {sections.map((section, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`px-4 py-2 flex-1 sm:flex-none transition-all ${
                activeTab === index
                  ? "bg-white text-purple-800 border-b-2 border-purple-800"
                  : "hover:text-purple-600"
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto whitespace-pre-line text-sm sm:text-base leading-relaxed text-gray-700">
          {sections[activeTab].content}
        </div>
      </div>
    </div>
  );
}
