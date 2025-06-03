import { IProduct } from "@/types";
import React from "react";

const Card: React.FC<IProduct> = ({ name, price, imgUrl }) => {
  return (
    <div className="w-80 h-70  bg-gradient-to-r from-purple-900 to-purple-600 text-black rounded-lg shadow-md transition-transform transform hover:from-yellow-400 hover:to-yellow-500 hover:scale-[1.02] hover:shadow-lg hover:shadow-yellow-500/25 active:scale-[0.98] flex flex-col items-center p-4">
      <h3 className="text-xl font-bold text-center">{name}</h3>
      <img
        className="w-full h-48 object-cover rounded-lg mt-2"
        src={imgUrl}
        alt={name}
      />
      <p className="font-semibold mt-4">Price: ${price}</p>
    </div>
  );
};

export default Card;