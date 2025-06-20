"use client";
import { useState } from "react";

interface Props {
  productId: string;
  currentPrice: number;
  token: string;
  onSuccess: () => void;
}

const QuickPriceEditor: React.FC<Props> = ({ productId, currentPrice, token, onSuccess }) => {
  const [editing, setEditing] = useState(false);
  const [price, setPrice] = useState(currentPrice.toString());
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSave = async () => {
    if (isNaN(Number(price))) {
      setMessage("Precio inválido.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`https://arcana-back.onrender.com/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          price: Number(price),
        }),
      });

      if (!res.ok) throw new Error("Error al actualizar el precio.");

      setMessage("✅ Precio actualizado.");
      setEditing(false);
      onSuccess(); // Refresca productos
    } catch (err) {
      console.error(err);
      setMessage("❌ Error al guardar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-sm text-white flex flex-col items-center">
      {editing ? (
        <div className="flex gap-2 items-center">
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="bg-gray-800 border border-yellow-500/30 text-white px-2 py-1 w-24 rounded"
          />
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-yellow-500 text-black px-2 py-1 rounded hover:bg-yellow-400 transition"
          >
            Guardar
          </button>
          <button
            onClick={() => setEditing(false)}
            className="text-gray-400 hover:text-red-400 transition cursor-pointer"
          >
            Cancelar
          </button>
        </div>
      ) : (
        <button
          onClick={() => setEditing(true)}
          className="text-xs text-yellow-500 hover:text-amber-200 cursor-pointer"
        >
          Editar precio
        </button>
      )}
      {message && <p className="text-xs mt-1">{message}</p>}
    </div>
  );
};

export default QuickPriceEditor;
