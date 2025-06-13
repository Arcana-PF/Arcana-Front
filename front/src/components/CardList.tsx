'use client';

import React, { useEffect, useState, useMemo } from "react";
import Card from "./Card";
import { getProductsDB } from "@/utils/product.helper";
import { useRouter } from "next/navigation";
import { IProduct } from "@/types";

interface CardListProps {
  sort?: string;
  page?: number;
  category?: string;
  itemsPerPage?: number;
  onTotalPagesChange?: (total: number) => void;
}

const CardList: React.FC<CardListProps> = ({
  sort = "Recomendados",
  page = 1,
  category = "Todos",
  itemsPerPage = 8,
  onTotalPagesChange,
}) => {
  const router = useRouter();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProductsDB();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Error al cargar productos.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ✅ Corrección en el filtrado por categoría
  const filtered = useMemo(() => {
    if (category === "Todos") return products;
    return products.filter((product) =>
      product.categories.some((c) => c.name === category)
    );
  }, [category, products]);

  // ✅ Ordenamiento de productos con una mejor estructura
  const sortedProducts = useMemo(() => {
    const sorted = [...filtered];
    switch (sort) {
      case "Precio: Menor a Mayor":
        return sorted.sort((a, b) => a.price - b.price);
      case "Precio: Mayor a Menor":
        return sorted.sort((a, b) => b.price - a.price);
      case "Novedades":
        return sorted.reverse(); // Asumiendo que el backend envía productos más nuevos primero
      default:
        return sorted;
    }
  }, [sort, filtered]);

  // ✅ Cálculo de la paginación
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const paginated = sortedProducts.slice(startIndex, startIndex + itemsPerPage);

  // ✅ Notificación de cambio de páginas disponibles
  useEffect(() => {
    if (onTotalPagesChange) {
      onTotalPagesChange(totalPages);
    }
  }, [totalPages, onTotalPagesChange]);

  // ✅ Manejo del estado de carga y errores
  if (loading) {
    return <div className="text-center text-gray-500">Cargando productos...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  // ✅ Renderizado optimizado y corrección en la propagación de props
  return (
    <div className="flex flex-wrap items-center gap-4 p-4 justify-center">
      {paginated.length ? (
        paginated.map((product) => (
          <Card
            key={product.id}
            {...product}
            onClick={() => router.push(`/products/${product.id}`)}
          />
        ))
      ) : (
        <div className="text-center text-gray-500">No hay productos disponibles.</div>
      )}
    </div>
  );
};

export default CardList;