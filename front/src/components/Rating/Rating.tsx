"use client";

import React from "react";
import { Star } from "lucide-react";

interface RatingProps {
  value?: number; 
  max?: number; 
}

const Rating: React.FC<RatingProps> = ({ value, max = 5 }) => {
  if (!value || value <= 0) {
    return (
      <span className="text-sm text-gray-500 italic">
        Producto aún no calificado
      </span>
    );
  }

  const filled = Math.floor(value);
  const hasHalf = value % 1 >= 0.5;

  return (
    <div className="flex items-center gap-1">
      {[...Array(max)].map((_, index) => {
        const filledStar = index < filled;
        const halfStar = index === filled && hasHalf;

        return (
          <Star
            key={index}
            className={`w-4 h-4 ${
              filledStar || halfStar
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        );
      })}
      <span className="text-xs text-gray-600 ml-1 font-medium">{value.toFixed(1)}</span>
    </div>
  );
};

export default Rating;