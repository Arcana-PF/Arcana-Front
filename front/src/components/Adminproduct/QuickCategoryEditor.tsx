"use client";
import { useEffect, useState } from "react";

interface ICategory {
  id: string;
  name: string;
  isActive: boolean;
}

interface Props {
  productId: string;
  currentCategories: string[];
  token: string;
  onSuccess: () => void;
}

const QuickCategoryEditor: React.FC<Props> = ({
  productId,
  currentCategories,
  token,
  onSuccess,
}) => {
  const [editing, setEditing] = useState(false);
  const [allCategories, setAllCategories] = useState<ICategory[]>([]);
  const [selected, setSelected] = useState<string[]>(currentCategories);
  const [loading, setLoading] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("https://arcana-back.onrender.com/categories", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data: ICategory[] = await res.json();
        setAllCategories(data);
      } catch (err) {
        console.error(err);
        setMessage("❌ Error al cargar categorías");
      }
    };

    if (editing) fetchCategories();
  }, [editing, token]);

  const toggleCategory = (name: string) => {
    setSelected((prev) =>
      prev.includes(name)
        ? prev.filter((c) => c !== name)
        : [...prev, name]
    );
  };

  const handleAddNewCategory = async () => {
    const trimmed = newCategory.trim();
    if (!trimmed || selected.includes(trimmed)) return;

    try {
      const exists = allCategories.some(
        (cat) => cat.name.toLowerCase() === trimmed.toLowerCase()
      );

      if (!exists) {
        const res = await fetch("https://arcana-back.onrender.com/categories", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: trimmed }),
        });

        if (!res.ok) throw new Error("No se pudo crear la categoría");

        const newCat: ICategory = await res.json();
        setAllCategories((prev) => [...prev, newCat]);
      }

      setSelected((prev) => [...prev, trimmed]);
      setNewCategory("");
    } catch (err) {
      console.error(err);
      setMessage("❌ Error al crear nueva categoría");
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`https://arcana-back.onrender.com/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ categoryNames: selected }),
      });

      if (!res.ok) throw new Error("Error al actualizar categorías.");

      setMessage("✅ Categorías actualizadas.");
      setEditing(false);
      onSuccess();
    } catch (err) {
      console.error(err);
      setMessage("❌ Error al guardar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-sm text-white flex flex-col items-center mt-2">
      {editing ? (
        <div className="w-64 bg-zinc-900 border border-yellow-600 rounded-xl p-4 shadow-md space-y-3">
          <p className="text-yellow-400 text-center text-sm font-semibold">Editar categorías</p>

          {/* Lista de categorías */}
          <div className="grid grid-cols-2 gap-1 text-xs text-yellow-300 max-h-40 overflow-y-auto border border-yellow-500/10 p-2 rounded">
            {allCategories.map((cat) => (
              <label key={cat.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selected.includes(cat.name)}
                  onChange={() => toggleCategory(cat.name)}
                  className="accent-yellow-500"
                />
                {cat.name}
              </label>
            ))}
          </div>

          {/* Input nueva categoría */}
          <div className="flex items-center gap-2 mt-1">
            <input
              type="text"
              placeholder="Nueva categoría"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="flex-1 text-sm p-1 rounded bg-zinc-800 border border-yellow-400 text-yellow-200 placeholder:text-yellow-500"
            />
            <button
              type="button"
              onClick={handleAddNewCategory}
              className="bg-yellow-500 hover:bg-yellow-400 text-black px-2 py-1 rounded text-xs font-semibold"
            >
              +
            </button>
          </div>

          {/* Acciones */}
          <div className="flex justify-between mt-2">
            <button
              onClick={handleSave}
              disabled={loading}
              className="bg-yellow-500 hover:bg-yellow-400 text-black px-3 py-1 rounded text-xs font-semibold transition disabled:opacity-60"
            >
              {loading ? "Guardando..." : "Guardar"}
            </button>
            <button
              onClick={() => setEditing(false)}
              className="text-red-400 hover:underline text-xs"
            >
              Cancelar
            </button>
          </div>

          {message && <p className="text-yellow-300 text-center text-xs">{message}</p>}
        </div>
      ) : (
        <button
          onClick={() => setEditing(true)}
          className="text-xs text-yellow-400 hover:text-yellow-300 underline mt-1 transition"
        >
          🗂️ Editar categorías
        </button>
      )}
    </div>
  );
};

export default QuickCategoryEditor;
