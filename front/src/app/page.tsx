'use client'; 

import { useState } from 'react';
import CardList from "@/components/CardList"
import ComponentSlider from "@/components/Slider/SliderComponent"
import { Sparkles, Moon, Star, Eye, Heart, Shield, ArrowRight, Mail, Award, Users } from "lucide-react"
import Link from "next/link"


export default function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  return (
    <main className="min-h-screen w-full bg-gray-50 text-gray-900 overflow-x-hidden">
      {/* Slider principal */}
      <section className="relative">
        <ComponentSlider />
      </section>

      {/* Hero Stats */}
      <section className="py-16 bg-gradient-to-br from-purple-900 to-indigo-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('/images/pattern.svg')] bg-repeat opacity-10"></div>
        </div>
        <div className="relative max-w-screen-xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "5K+", label: "Clientes felices", icon: <Users className="w-6 h-6" /> },
              { value: "300+", label: "Productos únicos", icon: <Sparkles className="w-6 h-6" /> },
              { value: "12+", label: "Años de experiencia", icon: <Award className="w-6 h-6" /> },
              { value: "100%", label: "Calidad garantizada", icon: <Shield className="w-6 h-6" /> }
            ].map((stat, index) => (
              <div key={index} className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="flex justify-center text-purple-300 mb-3">
                  {stat.icon}
                </div>
                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-sm font-medium text-purple-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categorías principales */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-purple-600/20 text-purple-300 rounded-full text-sm font-medium mb-4 border border-purple-500/30">
              <Sparkles className="w-4 h-4 mr-2" />
              Categorías
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Explora Arcana</h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Descubre nuestra selección cuidadosamente curada de productos auténticos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: <Moon className="w-8 h-8" />,
                title: "Cristales & Gemas",
                description: "Piedras naturales con propiedades únicas",
                gradient: "from-purple-600 to-indigo-600",
              },
              {
                icon: <Star className="w-8 h-8" />,
                title: "Tarot & Oráculos",
                description: "Barajas profesionales y herramientas místicas",
                gradient: "from-indigo-600 to-blue-600",
              },
              {
                icon: <Eye className="w-8 h-8" />,
                title: "Aromas Sagrados",
                description: "Inciensos, velas y aceites esenciales",
                gradient: "from-blue-600 to-teal-600",
              },
            ].map((category, index) => (
              <div
                key={index}
                className="group bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-700 hover:-translate-y-1"
              >
                <div
                  className={`w-16 h-16 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center text-white mb-6 group-hover:scale-105 transition-transform duration-300`}
                >
                  {category.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{category.title}</h3>
                <p className="text-gray-400 mb-4 leading-relaxed">{category.description}</p>
                <div className="flex items-center text-purple-400 font-medium group-hover:text-yellow-400 transition-colors duration-300">
                  <span className="text-sm">Explorar</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Productos destacados */}
<section className="py-20 bg-gradient-to-b from-gray-50 to-white">
  <div className="max-w-screen-xl mx-auto px-4">
    <div className="text-center mb-16">
      <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium mb-4 border border-purple-200">
        <Star className="w-4 h-4 mr-2 text-purple-600" />
        Productos Destacados
      </div>
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Seleccionados del mes</h2>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        Recorre nuestro catalogo completo y descubre todos nuestros productos
      </p>
    </div>

        <CardList 
        category="Velas" 
        sort="Precio: Menor a Mayor"
        page={currentPage}
        onTotalPagesChange={setTotalPages}
        itemsPerPage={4}
      />

      {/* Navegación de páginas */}
      <div className="flex gap-2 justify-center my-8">
        {Array.from({length: totalPages}, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-4 py-2 rounded ${currentPage === i + 1 ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
          >
            {i + 1}
          </button>
        ))}
      </div>

    <div className="text-center mt-12">
      <Link href="/products">
        <button className="cursor-pointer inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg">
          Explorar Catálogo Completo
          <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
        </button>
      </Link>
    </div>
  </div>
</section>

      {/* Sobre Arcana*/}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-purple-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('/images/pattern.svg')] bg-repeat opacity-10"></div>
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white/10 text-white rounded-full text-sm font-medium mb-6 border border-white/20">
            <Heart className="w-4 h-4 mr-2" />
            Nuestra Historia
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Sobre Arcana</h2>
          <p className="text-lg text-purple-100 leading-relaxed mb-12 max-w-3xl mx-auto">
            Desde hace más de una década, nos dedicamos a ofrecer productos auténticos para quienes buscan conectar con
            su espiritualidad. Cada pieza es seleccionada con cuidado y respeto por su origen y significado.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Award className="w-6 h-6" />,
                title: "Autenticidad",
                description: "Productos genuinos y verificados por expertos",
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: "Experiencia",
                description: "Más de 12 años sirviendo a la comunidad",
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: "Comunidad",
                description: "Miles de clientes satisfechos nos respaldan",
              },
            ].map((value, index) => (
              <div key={index} className="text-center">
                <div className="w-14 h-14 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-4 border border-yellow-500/30">
                  <div className="text-yellow-400">{value.icon}</div>
                </div>
                <h3 className="font-bold text-white mb-3">{value.title}</h3>
                <p className="text-sm text-purple-200 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-purple-600/20 text-purple-300 rounded-full text-sm font-medium mb-4 border border-purple-500/30">
              <Heart className="w-4 h-4 mr-2" />
              Testimonios
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Experiencias Reales</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                name: "María González",
                role: "Cliente desde 2020",
                content:
                  "La calidad de los productos es excepcional. Cada compra ha superado mis expectativas y el servicio al cliente es impecable.",
                rating: 5,
              },
              {
                name: "Carlos Mendoza",
                role: "Cliente frecuente",
                content:
                  "Llevo años comprando en Arcana. La autenticidad de sus productos y la atención personalizada hacen la diferencia.",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-800 p-8 rounded-xl hover:shadow-lg transition-all duration-300 border border-gray-700">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed italic">{`"${testimonial.content}"`}</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-white">{testimonial.name}</div>
                    <div className="text-sm text-gray-400">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter  */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="bg-gray-800 rounded-2xl p-12 shadow-xl border border-gray-700">
            <Mail className="w-12 h-12 text-purple-400 mx-auto mb-6" />
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Mantente Conectado</h2>
            <p className="text-gray-400 mb-8 leading-relaxed">
              Recibe noticias sobre nuevos productos, ofertas especiales y contenido exclusivo sobre el mundo esotérico
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Ingresa tu email"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-700 bg-gray-900 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 cursor-pointer border border-yellow-600/50">
                Suscribirse
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-4">Sin spam. Cancela cuando quieras.</p>
          </div>
        </div>
      </section>

      {/* Separador final */}
      <div className="h-8 bg-gradient-to-t from-gray-900 to-gray-800" />
    </main>
  )
}