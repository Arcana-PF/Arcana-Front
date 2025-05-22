import { IProduct } from "@/types";
import React from "react";

const Card: React.FC<{ product: IProduct }> = ({ product }) => {
  const { name, price, description, imgUrl } = product;

  return (
    <div className="w-full max-w-sm min-h-[400px] bg-white rounded-lg shadow-md transition-transform transform hover:scale-105 flex flex-col items-center p-4">
      <h3 className="text-xl font-bold text-gray-800 text-center">{name}</h3>
      <img className="w-full h-48 object-cover rounded-lg" src={imgUrl} alt={name} />
      <p className="text-gray-700 font-semibold">Price: ${price}</p>
      <p className="text-gray-600 text-center text-sm px-4">{description}</p>
    </div>
  );
};

export default Card;