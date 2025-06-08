'use client';

import React, { useState } from 'react';
import CardList from '@/components/CardList';
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const Products = () => {
  const [sort, setSort] = useState('Recomendados');
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState('Todos');
  const [totalPages, setTotalPages] = useState(1);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSort(e.target.value);
    setPage(1);
  };

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-purple-50 to-gray-50">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-r from-purple-900 to-purple-700 py-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 flex items-center justify-center">
          <Sparkles className="w-8 h-8 mr-3 text-yellow-400" />
          Nuestra Colección
          <Sparkles className="w-8 h-8 ml-3 text-yellow-400" />
        </h1>
        <p className="text-xl text-purple-100">
          Descubre productos místicos cuidadosamente seleccionados para tu viaje espiritual
        </p>
      </section>

      {/* Main Content */}
      <section className="w-full max-w-screen-xl mx-auto px-4 py-12">
        {/* Categorías */}
        <div className="flex overflow-x-auto pb-4 mb-8 scrollbar-hide">
          <div className="flex space-x-2">
            {['Todos', 'Amuletos', 'Tarot', 'Cristales', 'Inciensos', 'Libros', 'Velas'].map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setCategory(cat);
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors cursor-pointer ${
                  cat === category
                    ? 'bg-yellow-500 text-black font-semibold'
                    : 'bg-white text-purple-800 border border-purple-200 hover:bg-purple-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Título y ordenamiento */}
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-purple-900">Productos Destacados</h2>
          <div className="flex items-center space-x-2">
            <label htmlFor="sort" className="text-sm text-purple-700">
              Ordenar por:
            </label>
            <select
              id="sort"
              value={sort}
              onChange={handleSortChange}
              className="bg-white border border-purple-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-yellow-400 cursor-pointer"
            >
              <option>Recomendados</option>
              <option>Precio: Menor a Mayor</option>
              <option>Precio: Mayor a Menor</option>
              <option>Novedades</option>
            </select>
          </div>
        </div>

        {/* Grid de productos */}
        <CardList
          sort={sort}
          page={page}
          category={category}
          onTotalPagesChange={(total) => setTotalPages(total)}
        />
      </section>

      {/* Paginación */}
      <section className="w-full flex justify-center mt-12">
        <nav className="flex items-center space-x-2">
          <button
            onClick={handlePrev}
            disabled={page === 1}
            className="px-3 py-2 rounded-md bg-purple-100 text-purple-800 hover:bg-purple-200 flex items-center disabled:opacity-50 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Anterior
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-10 h-10 rounded-md transition-colors ${
                p === page
                  ? 'bg-yellow-500 text-black font-semibold'
                  : 'bg-white text-purple-800 hover:bg-purple-100'
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={handleNext}
            disabled={page === totalPages}
            className="px-3 py-2 rounded-md bg-purple-100 text-purple-800 hover:bg-purple-200 flex items-center disabled:opacity-50 cursor-pointer"
          >
            Siguiente <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </nav>
      </section>

      {/* Newsletter */}
      <section className="w-full bg-purple-900 py-12 px-4 mt-16">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Únete a nuestro círculo místico</h3>
          <p className="text-purple-200 mb-6">
            Recibe ofertas exclusivas y contenido espiritual directamente en tu correo
          </p>
          <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Tu email"
              className="flex-grow px-4 py-3 rounded-lg bg-purple-800/50 text-white placeholder-purple-300 border border-purple-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button className="px-6 py-3 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 transition-colors">
              Suscribirse
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Products;
