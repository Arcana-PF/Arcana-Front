import CardList from "@/components/CardList"
import ComponentSlider from "@/components/Slider/SliderComponent"
import { Sparkles, Moon, Star, Eye, Heart, Shield, ArrowRight, Mail, Award, Users } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-gray-50 text-gray-900 overflow-x-hidden">
      {/* Slider principal */}
      <section className="relative">
        <ComponentSlider />
      </section>

      {/* Hero Stats - Coherente con navbar */}
      <section className="py-12 bg-gradient-to-r from-purple-900 via-purple-800 to-purple-900 relative">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-screen-xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
            <div className="space-y-1">
              <div className="text-2xl md:text-3xl font-bold text-yellow-400">5K+</div>
              <div className="text-purple-200 text-sm">Clientes</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl md:text-3xl font-bold text-yellow-400">300+</div>
              <div className="text-purple-200 text-sm">Productos</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl md:text-3xl font-bold text-yellow-400">12+</div>
              <div className="text-purple-200 text-sm">Años</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl md:text-3xl font-bold text-yellow-400">95%</div>
              <div className="text-purple-200 text-sm">Satisfacción</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categorías principales */}
      <section className="py-20 bg-white">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4 mr-2" />
              Categorías
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Explora Arcana</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Descubre nuestra selección cuidadosamente curada de productos auténticos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: <Moon className="w-8 h-8" />,
                title: "Cristales & Gemas",
                description: "Piedras naturales con propiedades únicas",
                gradient: "from-purple-600 to-purple-700",
              },
              {
                icon: <Star className="w-8 h-8" />,
                title: "Tarot & Oráculos",
                description: "Barajas profesionales y herramientas místicas",
                gradient: "from-purple-700 to-purple-800",
              },
              {
                icon: <Eye className="w-8 h-8" />,
                title: "Aromas Sagrados",
                description: "Inciensos, velas y aceites esenciales",
                gradient: "from-purple-800 to-purple-900",
              },
            ].map((category, index) => (
              <div
                key={index}
                className="group bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1"
              >
                <div
                  className={`w-16 h-16 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center text-white mb-6 group-hover:scale-105 transition-transform duration-300`}
                >
                  {category.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{category.title}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{category.description}</p>
                <div className="flex items-center text-purple-700 font-medium group-hover:text-yellow-600 transition-colors duration-300">
                  <span className="text-sm">Explorar</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Productos destacados */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium mb-4">
              <Star className="w-4 h-4 mr-2" />
              Destacados
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Selección Especial</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Productos elegidos por su calidad excepcional y energía única
            </p>
          </div>

          <CardList />

          <div className="text-center mt-12">
  <Link href="/products">
    <button className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 shadow-lg click-pointer">
      Ver Catálogo Completo
      <ArrowRight className="w-5 h-5 ml-2" />
    </button>
  </Link>
</div>
        </div>
      </section>

      {/* Sobre Arcana */}
      <section className="py-20 bg-gradient-to-r from-purple-900 via-purple-800 to-purple-900 relative">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white/20 text-white rounded-full text-sm font-medium mb-6">
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
                <div className="w-14 h-14 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-4">
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
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium mb-4">
              <Heart className="w-4 h-4 mr-2" />
              Testimonios
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Experiencias Reales</h2>
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
              <div key={index} className="bg-gray-50 p-8 rounded-xl hover:shadow-lg transition-all duration-300">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed italic">{`"${testimonial.content}"`}</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-gradient-to-b from-gray-100 to-gray-200">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="bg-white rounded-2xl p-12 shadow-xl">
            <Mail className="w-12 h-12 text-purple-700 mx-auto mb-6" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Mantente Conectado</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Recibe noticias sobre nuevos productos, ofertas especiales y contenido exclusivo sobre el mundo esotérico
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Ingresa tu email"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105">
                Suscribirse
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-4">Sin spam. Cancela cuando quieras.</p>
          </div>
        </div>
      </section>

      {/* Separador final */}
      <div className="h-8 bg-gradient-to-t from-gray-100 to-gray-50" />
    </main>
  )
}
