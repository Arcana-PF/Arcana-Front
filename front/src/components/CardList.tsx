'use client'

import React, { useEffect, useState, useMemo } from "react";
import Card from "./Card";
import { getProductsDB } from "@/utils/product.helper";
import { useRouter } from "next/navigation";
import { IProduct } from "@/types";
import { useAuth } from "@/context/AuthContext";
import ToggleProductVisibilityButton from "./VisibilityButton/ToggleProductVisibilityButtonProps";
import QuickPriceEditor from "./Adminproduct/QuickPriceEditor";
import QuickCategoryEditor from "./Adminproduct/QuickCategoryEditor";


interface CardListProps {
  sort?: string;
  page?: number;
  categories?: string[];
  itemsPerPage?: number;
  onTotalPagesChange?: (total: number) => void;
}

const CardList: React.FC<CardListProps> = ({
  sort = "Recomendados",
  page = 1,
  categories = [],
  itemsPerPage = 8,
  onTotalPagesChange,
}) => {
  const router = useRouter();
  const { userData } = useAuth(); // 🔑 Para saber si es admin
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  useEffect(() => {
    fetchProducts();
  }, []);

  const filtered = useMemo(() => {
    if (categories.length === 0) return products;
    return products.filter((product) =>
      categories.every((cat) => product.categories.some((c) => c.name === cat))
    );
  }, [categories, products]);

  const visibleProducts = useMemo(() => {
    return filtered.filter((product) => userData?.user?.isAdmin || product.isActive);
  }, [filtered, userData]);

  const sortedProducts = useMemo(() => {
    const sorted = [...visibleProducts];
    switch (sort) {
      case "Precio: Menor a Mayor":
        return sorted.sort((a, b) => a.price - b.price);
      case "Precio: Mayor a Menor":
        return sorted.sort((a, b) => b.price - a.price);
      case "Novedades":
        return sorted.reverse();
      default:
        return sorted;
    }
  }, [sort, visibleProducts]);

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const paginated = sortedProducts.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    onTotalPagesChange?.(totalPages);
  }, [totalPages, onTotalPagesChange]);

  if (loading) return <div className="text-center text-gray-500">Cargando productos...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="flex flex-wrap items-center gap-4 p-4 justify-center">
      {paginated.length ? (
        paginated.map((product) => (
          <div key={product.id} className="relative">
            <Card
              {...product}
              onClick={() => router.push(`/products/${product.id}`)}
            />
            {/* Muestra la nota si es admin y el producto está inactivo */}
            {userData?.user?.isAdmin && !product.isActive && (
              <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded shadow-md z-10">
                Producto inactivo
              </div>
            )}
            {/* Botón de visibilidad solo para admin */}
            {userData?.user?.isAdmin && (
  <div className="mt-2 flex flex-col items-center gap-2">
    <ToggleProductVisibilityButton
      productId={product.id}
      isActive={product.isActive}
      token={userData.token}
      onToggle={fetchProducts}
    />
    <QuickPriceEditor
      productId={product.id}
      currentPrice={product.price}
      token={userData.token}
      onSuccess={fetchProducts}
    />
    <QuickCategoryEditor
  productId={product.id}
  currentCategories={product.categories.map((c) => c.name)}
  token={userData.token}
  onSuccess={fetchProducts}
/>
  </div>
)}

          </div>
        ))
      ) : (
        <div className="text-center text-gray-500">
          No hay productos que coincidan con los filtros seleccionados.
        </div>
      )}
    </div>
  );
};

export default CardList;