"use client";

import { Award, Heart, Sparkles, Shield, Users } from "lucide-react";

export default function AboutUs() {
  return (
    <div className="w-full">
      {/* SECCIÓN OSCURA */}
      <section className="py-20 px-6 bg-gradient-to-br from-gray-900 to-purple-950 text-white relative overflow-hidden">
        {/* Fondo con patrón suave */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-[url('/images/pattern.svg')] bg-repeat"></div>
        </div>

        <div className="relative max-w-6xl mx-auto text-center">
          {/* Encabezado */}
          <div className="mb-14">
            <div className="inline-flex items-center px-4 py-2 bg-purple-600/20 text-purple-300 rounded-full text-sm font-medium border border-purple-500/30 mb-4">
              <Heart className="w-4 h-4 mr-2" />
              Sobre Nosotros
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Bienvenido a Arcana</h1>
            <p className="text-lg text-purple-200 max-w-3xl mx-auto">
              Desde hace más de una década, en Arcana conectamos personas con lo sagrado a través de productos auténticos, seleccionados con intención, amor y respeto.
            </p>
          </div>

          {/* Sección de valores */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-10 text-left">
            {[
              {
                icon: <Sparkles className="w-7 h-7 text-purple-400" />,
                title: "Autenticidad Espiritual",
                desc: "Cada producto está cuidadosamente curado por su origen simbólico y energético.",
              },
              {
                icon: <Shield className="w-7 h-7 text-yellow-400" />,
                title: "Compromiso Ético",
                desc: "Trabajamos con respeto hacia tradiciones, culturas y prácticas sostenibles.",
              },
              {
                icon: <Award className="w-7 h-7 text-indigo-400" />,
                title: "Experiencia & Confianza",
                desc: "Con más de 12 años guiando a nuestra comunidad hacia experiencias místicas genuinas.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300"
              >
                <div className="mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-white">{item.title}</h3>
                <p className="text-purple-200 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Cierre oscuro */}
          <div className="mt-20 max-w-3xl mx-auto text-purple-300 text-center text-base leading-relaxed">
            Creemos en el poder de los rituales, en la energía de los cristales y en el alma de cada objeto. Arcana es más que una tienda: es una experiencia para quienes buscan algo más profundo.
          </div>
        </div>
      </section>

      {/* SECCIÓN CLARA */}
      <section className="py-20 px-6 bg-gray-100 text-gray-800">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Nuestra Misión
          </h2>
          <p className="text-lg max-w-3xl mx-auto mb-10 text-gray-700">
            En Arcana nos dedicamos a ofrecer productos esotéricos de calidad con una fuerte base espiritual, fomentando el autoconocimiento, la armonía y la conexión con lo invisible.
          </p>

          <div className="flex flex-col md:flex-row justify-center gap-8">
            <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200 w-full md:w-1/3">
              <Users className="w-8 h-8 text-purple-700 mb-3 mx-auto" />
              <h4 className="text-xl font-semibold mb-2">Comunidad</h4>
              <p className="text-sm text-gray-600">Cultivamos una comunidad consciente, empática y conectada espiritualmente.</p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200 w-full md:w-1/3">
              <Heart className="w-8 h-8 text-pink-600 mb-3 mx-auto" />
              <h4 className="text-xl font-semibold mb-2">Pasión</h4>
              <p className="text-sm text-gray-600">Todo lo que hacemos nace del amor por lo místico, lo ritual y lo sagrado.</p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200 w-full md:w-1/3">
              <Sparkles className="w-8 h-8 text-yellow-600 mb-3 mx-auto" />
              <h4 className="text-xl font-semibold mb-2">Inspiración</h4>
              <p className="text-sm text-gray-600">Buscamos inspirar el crecimiento personal a través de objetos cargados de significado.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
