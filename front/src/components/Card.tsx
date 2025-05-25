import { IProduct } from "@/types";
import React from "react";

const Card: React.FC<IProduct> = ({ name, price, imgUrl }) => {
  return (
    <div className="w-full max-w-sm min-h-[210px] bg-white rounded-lg shadow-md transition-transform transform hover:scale-105 flex flex-col items-center p-4">
      <h3 className="text-xl font-bold text-gray-800 text-center">{name}</h3>
      <img className="w-full h-48 object-cover rounded-lg" src={imgUrl} alt={name} />
      <p className="text-gray-700 font-semibold">Price: ${price}</p>
    </div>
  );
};

export default Card;