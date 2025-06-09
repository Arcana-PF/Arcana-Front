"use client";

import React, { useEffect } from "react";
import Card from "./Card";
import mock_products from "@/utils/mock_products";
import { useRouter } from "next/navigation";

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
  
  let filtered = category === "Todos"
    ? mock_products
    : mock_products.filter((product) => product.category === category);

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

  return (
    <div className="flex flex-wrap items-center gap-4 p-4 justify-center">
      {paginated.map((product) => (
        <Card 
          key={product.id}
          {...product}
          onClick={() => router.push(`/product/${product.id}`)}
        />
      ))}
    </div>
  );
};

export default CardList;