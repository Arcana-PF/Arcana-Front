"use client";
import { IProduct } from "@/types";
import React from "react";

const ProductDetail: React.FC<IProduct> = ({ id, name, imgUrl, description, stock, price, category }) => {
  return (
    <section className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden p-6 space-y-4">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Imagen del producto */}
        <img
          src={imgUrl ?? "/placeholder-image.jpg"}
          alt={name ?? "Imagen del producto"}
          className="w-full md:w-1/2 max-h-96 object-cover rounded-md shadow-lg"
        />

        {/* Detalles del producto */}
        <article className="flex flex-col justify-center md:w-1/2 space-y-3">
          <h1 className="text-3xl font-bold text-gray-800">{name ?? "Producto sin nombre"}</h1>
          <h3 className="text-lg text-gray-700">{description ?? "No hay descripción disponible."}</h3>
          <p className="text-gray-600">
            Precio: <span className="font-semibold text-indigo-600">${price}</span>
          </p>
          <p className="text-gray-600">
            Stock disponible: <span className="font-semibold">{stock}</span>
          </p>
          <p className="text-gray-600">
            Categoría: <span className="font-semibold">{category}</span>
          </p>
        </article>
      </div>
    </section>
  );
};

export default ProductDetail;