'use client';
import React from "react";
import { IProduct } from "@/types";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
  const category = categories.length > 0 ? categories[0].name : "Sin categoría"; // Extrae la primera categoría
  const handleCardClick = (e: React.MouseEvent) => {
    // Solo navega si el click no fue en el botón de carrito/favoritos
    if (!(e.target as HTMLElement).closest('button')) {
      router.push(`/product/${id}`);
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!userData?.token) {
      Swal.fire({
        icon: "warning",
        title: "Inicia sesión",
        text: "Debes iniciar sesión para agregar productos al carrito.",
        confirmButtonColor: "#7e22ce",
        confirmButtonText: "Ir al login",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/login";
        }
      });
      return;
    }

    let cart: Array<IProduct & { quantity?: number }> = [];
    try {
      const storedCart = localStorage.getItem("cart");
      if (storedCart) {
        cart = JSON.parse(storedCart);
      }
    } catch (error) {
      console.error("Error al parsear el carrito:", error);
    }

    const productIndex = cart.findIndex((item) => item.id === id);
    
    if (productIndex !== -1) {
      const newQuantity = (cart[productIndex].quantity || 0) + 1;
      if (newQuantity > stock) {
        Swal.fire({
          icon: "error",
          title: "Stock insuficiente",
          text: `Solo quedan ${stock} unidades disponibles.`,
          confirmButtonColor: "#ef4444",
        });
        return;
      }
      cart[productIndex].quantity = newQuantity;
    } else {
      if (1 > stock) {
        Swal.fire({
          icon: "error",
          title: "Stock insuficiente",
          text: `Solo quedan ${stock} unidades disponibles.`,
          confirmButtonColor: "#ef4444",
        });
        return;
      }
      cart.push({ 
        id, 
        name, 
        imgUrl, 
        description, 
        price, 
        stock, 
        isActive: true, 
        categories, 
        quantity: 1 
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    const toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      }
    });

    await toast.fire({
      icon: "success",
      title: "¡Agregado al carrito!",
      background: "#7e22ce",
      color: "#fff",
      iconColor: "#facc15",
    });
  };

  return (
    <div 
      className="group relative w-64 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer"
      onClick={onClick || handleCardClick} 
    >
      {/* Imagen del producto */}
      <div className="relative h-56 w-full overflow-hidden bg-gray-100">
        <Image
          src={imgUrl}
          alt={`${name} - ${category}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <span className="px-2 py-1 bg-purple-600 text-white text-xs font-medium rounded-full">
            {category}
          </span>
        </div>
        
        {/* Rating */}
        {rating && (
          <div className="absolute bottom-3 left-3 flex items-center bg-white/90 px-2 py-1 rounded-full">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-medium ml-1">{rating.toFixed(1)}</span>
          </div>
        )}

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

      {/* Contenido */}
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
          
          
          <button 
            className="p-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-white rounded-lg transition-all shadow-md flex items-center justify-center z-20"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="w-5 h-5 cursor-pointer" />
            <span className="ml-2 text-sm font-medium cursor-pointer">Agregar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;