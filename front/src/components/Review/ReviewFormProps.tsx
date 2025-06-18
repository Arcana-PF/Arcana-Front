"use client";

import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

const APIURL = process.env.NEXT_PUBLIC_API_URL;

interface ReviewFormProps {
  productId: string;
  userToken: string;
  /** Si existe, indica que el usuario ya registró su reseña */
  existingReview?: { rating: number; comment: string } | null;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  productId,
  userToken,
  existingReview = null,
}) => {
  // Si ya existe una reseña, se muestran esos datos y el formulario no se renderiza.
  // En caso contrario, se muestra el formulario.
  const [rating, setRating] = useState<number>(
    existingReview ? existingReview.rating : 0
  );
  const [comment, setComment] = useState<string>(
    existingReview ? existingReview.comment : ""
  );
  const [wordCount, setWordCount] = useState<number>(0);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const maxWords = 120;

  // Actualiza la cuenta de palabras cada vez que cambia la reseña.
  useEffect(() => {
    const count = comment.trim() ? comment.trim().split(/\s+/).length : 0;
    setWordCount(count);
  }, [comment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones básicas.
    if (!rating || rating < 1 || rating > 5) {
      Swal.fire("Error", "Por favor, selecciona una calificación entre 1 y 5.", "error");
      return;
    }
    if (!comment.trim()) {
      Swal.fire("Error", "Por favor, escribe una reseña.", "error");
      return;
    }
    if (wordCount > maxWords) {
      Swal.fire("Error", "La reseña excede el máximo de 120 palabras.", "error");
      return;
    }

    setSubmitting(true);
    try {
      // Se envía la reseña al backend. Asegúrate de tener este endpoint implementado.
      const response = await fetch(`${APIURL}/products/${productId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          rating,
          comment,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al enviar la reseña.");
      }

      Swal.fire("¡Éxito!", "Tu reseña ha sido enviada correctamente.", "success");
      // Aquí podrías actualizar el estado para reflejar que ya existe una reseña,
      // por ejemplo: setExistingReview({ rating, comment }); o redirigir.
    } catch (error: unknown) {
      let message = "Error al enviar la reseña.";
      if (error instanceof Error) {
        message = error.message;
      }
      Swal.fire("Error", message, "error");
    }
  };

  return (
    <div className="max-w-xl mx-auto my-8 p-6 border rounded-lg shadow bg-white">
      <h2 className="text-xl font-semibold mb-4">Escribe tu reseña</h2>
      {existingReview ? (
        <p className="text-green-700">
          Ya has enviado una reseña para este producto.
        </p>
      ) : (
        <form onSubmit={handleSubmit}>
          {/* Selección de calificación */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Calificación (1-5)
            </label>
            <select
              value={rating}
              onChange={(e) => setRating(parseInt(e.target.value, 10))}
              className="w-full p-2 border rounded"
            >
              <option value={0}>Seleccione...</option>
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          {/* Reseña en texto con límite de palabras */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reseña (máx. 120 palabras)
            </label>
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Escribe tu reseña aquí..."
            />
            <p className="text-xs text-gray-500 mt-1">
              {wordCount} de {maxWords} palabras
            </p>
          </div>

          <button
            type="submit"
            disabled={submitting || wordCount > maxWords}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 disabled:opacity-50"
          >
            {submitting ? "Enviando..." : "Enviar reseña"}
          </button>
        </form>
      )}
    </div>
  );
};

export default ReviewForm;