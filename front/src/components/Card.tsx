'use client';
import React from "react";
import { IProduct } from "@/types";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import Rating from "./Rating/Rating";

const APIURL = process.env.NEXT_PUBLIC_API_URL;

interface ICardProps extends IProduct {
  rating?: number;
  onAddToFavorites?: () => void;
  onClick?: () => void;
}

const Card: React.FC<ICardProps> = ({
  id,
  name,
  description,
  price,
  imgUrl,
  categories,
  stock,
  rating = 4.5,
  onAddToFavorites,
  onClick
}) => {
  const { userData } = useAuth();
  const router = useRouter();

  // Muestra hasta 3 categorías
  const displayedCategories = categories.slice(0, 3);
  // También extrae la primera categoría como fallback
  const primaryCategory = categories.length > 0 ? categories[0].name : "Sin categoría";

  // Navega al detalle del producto si el click no proviene de un botón
  const handleCardClick = (e: React.MouseEvent) => {
    if (!(e.target as HTMLElement).closest('button') && !onClick) {
      router.push(`/product/${id}`);
    }
  };

  // Maneja el agregar producto al carrito
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();

    // Si el usuario no está autenticado, dirigimos a login y mostramos advertencia
    if (!userData?.token) {
      Swal.fire({
        icon: "warning",
        title: "Inicia sesión",
        text: "Debes iniciar sesión para agregar productos al carrito.",
        confirmButtonColor: "#7e22ce",
        confirmButtonText: "Ir al login",
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/login");
        }
      });
      return;
    }

    try {
      // Se hace la solicitud POST para agregar el producto al carrito
      const response = await fetch(`${APIURL}/cart/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.token}`,
        },
        body: JSON.stringify({
          productId: id,
          quantity: 1,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => "Error desconocido");
        // Si errorData tiene una propiedad "message", úsala; de lo contrario, conviértelo a string
        const errorMessage =
          typeof errorData === "string"
            ? errorData
            : errorData.message || JSON.stringify(errorData);
        Swal.fire({
          icon: "error",
          title: "Error al agregar producto",
          text: errorMessage,
          confirmButtonColor: "#ef4444",
        });
        return;
      }

      Swal.fire({
        icon: "success",
        title: "¡Agregado al carrito!",
        background: "#7e22ce",
        color: "#fff",
        iconColor: "#facc15",
      });

    } catch (error) {
      console.error("Error inesperado al agregar al carrito:", error);
      Swal.fire({
        icon: "error",
        title: "Error inesperado",
        text: "Inténtalo de nuevo más tarde.",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  return (
    <div
      className="group relative w-64 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer"
      onClick={onClick || handleCardClick}
    >
      {/* Imagen del producto */}
      <div className="relative h-56 w-full overflow-hidden bg-gray-100">
        <img
          src={imgUrl}
          alt={`${name} - ${primaryCategory}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Badges de múltiples categorías */}
        {categories.length > 0 && (
          <div className="absolute top-2 left-2 flex gap-1 flex-wrap max-w-full">
            {displayedCategories.map((cat) => (
              <span
                key={cat.name}
                className="bg-purple-700/80 text-white text-[10px] px-2 py-0.5 rounded-full shadow-sm truncate max-w-[80px]"
                title={cat.name}
              >
                {cat.name}
              </span>
            ))}
          </div>
        )}

        {/* Panel de rating */}
        <div className="absolute bottom-3 left-3 bg-white/90 px-2 py-1 rounded-full">
          <Rating value={rating} />
        </div>

        {/* Botón de favoritos */}
        <button
          className="absolute top-3 right-3 p-1.5 bg-white/80 rounded-full backdrop-blur-sm hover:bg-white transition-colors shadow-sm z-20 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onAddToFavorites?.();
          }}
        >
          <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
        </button>
      </div>

      {/* Contenido del card */}
      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">{name}</h3>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{description}</p>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-purple-700">
              ${price.toLocaleString('es-AR')}
            </p>
            <p className={`text-xs ${stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stock > 0 ? `Disponible (${stock})` : 'Agotado'}
            </p>
          </div>

          {!userData?.user?.isAdmin && (
            <button
              className="p-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-white rounded-lg transition-all shadow-md flex items-center justify-center z-20"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-5 h-5 cursor-pointer" />
              <span className="ml-2 text-sm font-medium cursor-pointer">Agregar</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;