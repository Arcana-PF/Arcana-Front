"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import CardList from "@/components/CardList"
import { Sparkles, ChevronLeft, ChevronRight, Filter, X, SlidersHorizontal, ChevronDown } from "lucide-react"

const Products = () => {
  const searchParams = useSearchParams()
  const [sort, setSort] = useState("Recomendados")
  const [page, setPage] = useState(1)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [showFilters, setShowFilters] = useState(true)

  const allCategories = [
    "Amuletos",
    "Tarot",
    "Oraculos",
    "Cristales",
    "Inciensos",
    "Sahumerios",
    "Estatuillas",
    "Libros",
    "Velas",
    "Specials",
    "Quemantes",
  ]

  // Leer parámetros de la URL al cargar
  useEffect(() => {
    const param = searchParams.get("category")
    if (param) {
      setSelectedCategories([param])
    }
  }, [searchParams])

  const toggleCategory = (cat: string) => {
    setPage(1)
    setSelectedCategories((prev) => (prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]))
  }

  const clearAllFilters = () => {
    setSelectedCategories([])
    setPage(1)
  }

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSort(e.target.value)
    setPage(1)
  }

  const handlePrev = () => {
    if (page > 1) {
      setPage(page - 1)
    }
  }

  const handleNext = () => {
    if (page < totalPages) {
      setPage(page + 1)
    }
  }

  const handlePageClick = (pageNum: number) => {
    setPage(pageNum)
  }

  // Calcular páginas visibles para la paginación
  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, page - delta); i <= Math.min(totalPages - 1, page + delta); i++) {
      range.push(i)
    }

    if (page - delta > 2) {
      rangeWithDots.push(1, "...")
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (page + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages)
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section - Reducido */}
      <section className="w-full bg-gradient-to-r from-purple-900 via-purple-800 to-purple-900 py-12 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center px-4 py-2 bg-yellow-500/20 text-yellow-300 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4 mr-2" />
            Colección Completa
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Explora Arcana</h1>
          <p className="text-lg text-purple-100 max-w-2xl mx-auto">
            Descubre productos místicos cuidadosamente seleccionados
          </p>
        </div>
      </section>

      {/* Filtros y Controles */}
      <section className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          {/* Header de controles */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-800 rounded-lg hover:bg-purple-200 transition-colors cursor-pointer"
              >
                <SlidersHorizontal className="w-4 h-4 " />
                Filtros
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
              </button>

              {selectedCategories.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    {selectedCategories.length} categoría{selectedCategories.length !== 1 ? "s" : ""} seleccionada
                    {selectedCategories.length !== 1 ? "s" : ""}
                  </span>
                  <button
                    onClick={clearAllFilters}
                    className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                    Limpiar
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
              {/* Ordenamiento */}
              <div className="flex items-center gap-2">
                <label htmlFor="sort" className="text-sm text-gray-700 whitespace-nowrap">
                  Ordenar:
                </label>
                <select
                  id="sort"
                  value={sort}
                  onChange={handleSortChange}
                  className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent min-w-[160px] cursor-pointer"
                >
                  <option>Recomendados</option>
                  <option>Precio: Menor a Mayor</option>
                  <option>Precio: Mayor a Menor</option>
                  <option>Novedades</option>
                  <option>Más Vendidos</option>
                  <option>Alfabético A-Z</option>
                </select>
              </div>
            </div>
          </div>

          {/* Filtros de categorías */}
          {showFilters && (
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center gap-2 mb-3">
                <Filter className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Categorías:</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {allCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => toggleCategory(category)}
                    className={`group flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
                      selectedCategories.includes(category)
                        ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg scale-105"
                        : "bg-white text-gray-700 border border-gray-300 hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700"
                    }`}
                  >
                    <span>{category}</span>
                    {selectedCategories.includes(category) && <X className="w-3 h-3 ml-1" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Contenido Principal */}
      <section className="max-w-screen-xl mx-auto px-4 py-8">
        {/* Header de resultados */}
        <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {selectedCategories.length === 0
                ? "Todos los Productos"
                : selectedCategories.length === 1
                  ? `Categoría: ${selectedCategories[0]}`
                  : "Categorías Seleccionadas"}
            </h2>
            {selectedCategories.length > 1 && (
              <div className="flex flex-wrap gap-1">
                {selectedCategories.map((cat) => (
                  <span
                    key={cat}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-md"
                  >
                    {cat}
                    <button onClick={() => toggleCategory(cat)} className="hover:bg-purple-200 rounded-full p-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Grid de productos */}
        <div className="mb-12">
          <CardList
            sort={sort}
            page={page}
            categories={selectedCategories}
            onTotalPagesChange={(total) => setTotalPages(total)}
          />
        </div>
      </section>

      {/* Paginación mejorada */}
      {totalPages > 1 && (
        <section className="bg-gray-50 py-8">
          <div className="max-w-screen-xl mx-auto px-4">
            <nav className="flex items-center justify-center">
              <div className="flex items-center gap-1">
                {/* Botón anterior */}
                <button
                  onClick={handlePrev}
                  disabled={page === 1}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline cursor-pointer">Anterior</span>
                </button>

                {/* Números de página */}
                <div className="flex items-center gap-1 mx-2">
                  {getVisiblePages().map((pageNum, index) => (
                    <div key={index}>
                      {pageNum === "..." ? (
                        <span className="px-3 py-2 text-gray-500">...</span>
                      ) : (
                        <button
                          onClick={() => handlePageClick(pageNum as number)}
                          className={`w-10 h-10 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                            pageNum === page
                              ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg"
                              : "text-gray-700 bg-white border border-gray-300 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700"
                          }`}
                        >
                          {pageNum}
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Botón siguiente */}
                <button
                  onClick={handleNext}
                  disabled={page === totalPages}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span className="hidden sm:inline cursor-pointer">Siguiente</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </nav>

            {/* Info de paginación */}
            <div className="text-center mt-4">
              <span className="text-sm text-gray-600">
                Página {page} de {totalPages}
              </span>
            </div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="bg-gradient-to-r from-purple-900 via-purple-800 to-purple-900 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white/20 text-white rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            Únete al Círculo
          </div>
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">Descubre Nuevos Productos</h3>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Sé el primero en conocer nuestras novedades y ofertas exclusivas
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Tu email aquí..."
              className="flex-1 px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder-purple-200 border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            />
            <button className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 shadow-lg">
              Suscribirse
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Products
