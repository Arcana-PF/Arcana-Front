"use client";

import {
  Mail,
  MapPin,
  Phone,
  Building2,
  MessageSquare,
  Map as MapIcon,
} from "lucide-react";

const stores = [
  {
    country: "Argentina",
    city: "Buenos Aires",
    address: "Av. Corrientes 1234, CABA",
    phone: "+54 11 1234-5678",
    mapsLink:
      "https://www.google.com/maps/place/Av.+Corrientes+1234,+C1043AAY+CABA,+Argentina",
  },
  {
    country: "México",
    city: "Ciudad de México",
    address: "Av. Reforma 567, CDMX",
    phone: "+52 55 1234-5678",
    mapsLink:
      "https://www.google.com/maps/place/Av.+Reforma+567,+Ciudad+de+México,+México",
  },
  {
    country: "Colombia",
    city: "Bogotá",
    address: "Cra 7 #45-89, Bogotá",
    phone: "+57 1 234-5678",
    mapsLink:
      "https://www.google.com/maps/place/Cra+7+%2345-89,+Bogotá,+Colombia",
  },
];

export default function ContactSection() {
  return (
    <section className="min-h-screen px-6 py-20 bg-gradient-to-br from-gray-900 to-purple-950 text-white relative overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[url('/images/pattern.svg')] bg-repeat"></div>
      </div>

      <div className="relative max-w-6xl mx-auto space-y-16">
        {/* Encabezado */}
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 bg-yellow-500/20 text-yellow-300 rounded-full text-sm font-medium border border-yellow-500/30 mb-4">
            <MessageSquare className="w-4 h-4 mr-2" />
            ¿Necesitás ayuda?
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">Contactanos</h2>
          <p className="text-purple-200 text-lg max-w-xl mx-auto">
            Estamos disponibles para responder tus dudas o asistirte desde cualquiera de nuestras tiendas.
          </p>
        </div>

        {/* Métodos de contacto */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <a
            href="mailto:arcanaesotericstore@gmail.com"
            className="flex items-center gap-3 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-500 transition-all shadow-md hover:shadow-lg"
          >
            <Mail className="w-5 h-5" />
            Escribinos por Email
          </a>

          <a
            href="https://wa.me/541112345678"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-6 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-400 transition-all shadow-md hover:shadow-lg"
          >
            <Phone className="w-5 h-5" />
            Contactar por WhatsApp
          </a>
        </div>

        {/* Tiendas físicas */}
        <div className="grid md:grid-cols-3 gap-6">
          {stores.map((store, index) => (
            <div
              key={index}
              className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 backdrop-blur-md hover:bg-gray-800/70 transition-all duration-300"
            >
              <h3 className="text-lg font-bold text-yellow-300 flex items-center gap-2 mb-2">
                <Building2 size={18} />
                {store.city}, {store.country}
              </h3>
              <p className="text-purple-200 text-sm flex items-center gap-2">
                <MapPin size={16} />
                {store.address}
              </p>
              <p className="text-purple-200 text-sm flex items-center gap-2">
                <Phone size={16} />
                {store.phone}
              </p>
              <a
                href={store.mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 text-sm text-white bg-indigo-600 px-3 py-1.5 rounded hover:bg-indigo-700 transition"
              >
                Ver en Google Maps
              </a>
            </div>
          ))}
        </div>

        {/* Google Maps Embed */}
        <div className="mt-16 space-y-8">
          <h4 className="text-lg text-yellow-300 font-bold flex items-center gap-2">
            <MapIcon size={18} />
            Nuestras ubicaciones en el mapa
          </h4>

          <div className="grid md:grid-cols-3 gap-6">
            {stores.map((store, i) => (
              <div key={i}>
                <div className="mb-2 text-sm text-white font-semibold">
                  {store.city}, {store.country}
                </div>
                <iframe
                  src={`https://www.google.com/maps?q=${encodeURIComponent(store.address)}&output=embed`}
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  className="rounded-xl shadow-md border border-gray-700"
                ></iframe>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
