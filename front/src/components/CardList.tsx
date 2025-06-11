'use client';

import React, { useEffect, useState } from "react";
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
        setError("Error al cargar productos.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  let filtered = category === "Todos" ? products : products.filter((product) => product.category === category);

  switch (sort) {
    case "Precio: Menor a Mayor":
      filtered = [...filtered].sort((a, b) => a.price - b.price);
      break;
    case "Precio: Mayor a Menor":
      filtered = [...filtered].sort((a, b) => b.price - a.price);
      break;
    case "Novedades":
      filtered = [...filtered].sort((a, b) => b.id - a.id);
      break;
    default:
      break;
  }

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  useEffect(() => {
    if (onTotalPagesChange) {
      onTotalPagesChange(totalPages);
    }
  }, [totalPages, onTotalPagesChange]);

  const startIndex = (page - 1) * itemsPerPage;
  const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);

  if (loading) {
    return <div className="text-center text-gray-500">Cargando productos...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="flex flex-wrap items-center gap-4 p-4 justify-center">
      {paginated.length ? (
        paginated.map((product) => (
          <Card 
            key={product.id}
            {...product}
            onClick={() => router.push(`/product/${product.id}`)}
          />
        ))
      ) : (
        <div className="text-center text-gray-500">No hay productos disponibles.</div>
      )}
    </div>
  );
};

export default CardList;