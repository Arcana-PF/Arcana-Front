"use client";

import React, { useState } from "react";
import Swal from "sweetalert2";

const APIURL = process.env.NEXT_PUBLIC_API_URL;

interface ReviewFormProps {
  productId: string;
  userToken: string;
  existingRating?: number | null;
  hasPurchased: boolean;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  productId,
  userToken,
  existingRating = null,
  hasPurchased,
}) => {
  const [rating, setRating] = useState<number>(existingRating || 0);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rating || rating < 1 || rating > 5) {
      return Swal.fire("Error", "Selecciona una calificación entre 1 y 5.", "error");
    }

    if (!hasPurchased) {
      return Swal.fire("Error", "Aún no compraste este producto para puntuarlo.", "error");
    }

    setSubmitting(true);
    try {
      const response = await fetch(`${APIURL}/products/${productId}/rating`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({ score: rating }),
      });

      const data = await response.json();

      if (!response.ok) {
        const msg = data.error || data.message || "Error al enviar la calificación.";
        throw new Error(msg);
      }

      Swal.fire("¡Éxito!", "Tu calificación ha sido registrada.", "success");
    } catch (error: unknown) {
      let message = "Error al enviar la calificación.";
      if (error instanceof Error) message = error.message;
      Swal.fire("Error", message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-yellow-50 border border-yellow-300 p-6 rounded-2xl shadow-inner">
      <h2 className="text-lg font-semibold text-yellow-800 mb-4">¿Qué te pareció este producto?</h2>

      {existingRating != null ? (
        <p className="text-sm text-green-700">
          Ya calificaste este producto con <strong>{existingRating}</strong> estrella{existingRating > 1 && "s"}.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              Calificación (1 a 5 estrellas)
            </label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg p-2 bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value={0}>Selecciona una calificación...</option>
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg shadow disabled:opacity-50"
          >
            {submitting ? "Enviando..." : "Enviar calificación"}
          </button>
        </form>
      )}
    </div>
  );
};

export default ReviewForm;
