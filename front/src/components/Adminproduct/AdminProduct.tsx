"use client"

import { useEffect, useState } from "react"
import { useFormik } from "formik"
import Cookies from "js-cookie"
import { Sparkles } from "lucide-react"

type Category = {
  id: string
  name: string
  isActive: boolean
}

const ProductForm = () => {
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState("")
  const [errors, setErrors] = useState<string[]>([])
 const [categories, setCategories] = useState<Category[]>([]);

  const [useExistingCategory, setUseExistingCategory] = useState(true)

  const token = Cookies.get("userSession")

  useEffect(() => {
  if (!useExistingCategory) return;

  const loadCats = async () => {
    try {
      const res = await fetch("https://arcana-back.onrender.com/categories", {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      console.log("GET /categories", res.status);
      const data = await res.json();
      console.log("GET /categories data:", data);
      if (!Array.isArray(data)) throw new Error("No es un array");
      setCategories(data);
    } catch (err: any) {
      console.error("Error al cargar categorías:", err);
      setMessage("No se pudieron cargar categorías: " + err.message);
    }
  }
  loadCats();
}, [useExistingCategory, token]);

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      price: "",
      stock: "",
      img: null as File | null,
      categoryNames: "",
      newCategory: "",
    },
    onSubmit: async (values) => {
      const newErrors: string[] = []

      if (!values.name) newErrors.push("El nombre es requerido.")
      if (!values.description) newErrors.push("La descripción es requerida.")
      if (!values.price || isNaN(Number(values.price))) newErrors.push("El precio debe ser un número.")
      if (!values.stock || isNaN(Number(values.stock))) newErrors.push("El stock debe ser un número.")
      if (!useExistingCategory && !values.newCategory) newErrors.push("Debes ingresar un nombre de categoría nueva.")
      if (useExistingCategory && !values.categoryNames) newErrors.push("Debes seleccionar una categoría existente.")
      if (!values.img) newErrors.push("La imagen es requerida.")

      if (newErrors.length > 0) {
        setErrors(newErrors)
        return
      }

      try {
        setErrors([])
        setUploading(true)
        setMessage("Creando producto...")

        let finalCategory = values.categoryNames

        // Si crea una categoría nueva, la enviamos primero
        if (!useExistingCategory) {
          const catRes = await fetch("https://arcana-back.onrender.com/categories", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ name: values.newCategory }),
          })

          if (!catRes.ok) {
            throw new Error("Error al crear nueva categoría")
          }

          finalCategory = values.newCategory
        }

        // Crear producto sin imagen
        const productRes = await fetch("https://arcana-back.onrender.com/products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: values.name,
            description: values.description,
            price: Number(values.price),
            stock: Number(values.stock),
            imgUrl: "",
            categoryNames: [finalCategory],
          }),
        })

        if (!productRes.ok) {
          const errorText = await productRes.text()
          throw new Error("Error al crear producto: " + errorText)
        }

        const createdProduct = await productRes.json()
        const productId = createdProduct?.id || createdProduct?.product?.id

        if (!productId) throw new Error("No se recibió el ID del producto creado")

        // Subir imagen
        setMessage("Subiendo imagen...")

        const formData = new FormData()
        formData.append("file", values.img!)

        const uploadRes = await fetch(`https://arcana-back.onrender.com/files/uploadImage/${productId}`, {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!uploadRes.ok) {
          const errorText = await uploadRes.text()
          throw new Error("Error al subir imagen: " + errorText)
        }

        setMessage("Producto creado con imagen 🎉")
        formik.resetForm()
        // Recargar categorías por si se agregó una nueva
        setUseExistingCategory(true)
      } catch (err) {
        console.error(err)
        setMessage("Hubo un error: " + (err instanceof Error ? err.message : "Error desconocido"))
      } finally {
        setUploading(false)
      }
    },
  })

  return (
    <div className="max-w-3xl mx-auto bg-black/80 text-white rounded-xl p-8 border border-yellow-500/20 shadow-2xl mt-12">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="text-yellow-500" />
        <h2 className="text-2xl font-bold text-yellow-400">Nuevo Producto</h2>
      </div>

      {errors.length > 0 && (
        <ul className="bg-red-800/30 border border-red-500/20 p-4 rounded mb-4 text-sm text-red-300">
          {errors.map((err, i) => (
            <li key={i}>• {err}</li>
          ))}
        </ul>
      )}

      {message && (
        <p className="mb-4 text-sm text-yellow-400 border border-yellow-500/10 rounded p-2">{message}</p>
      )}

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {/* Nombre */}
        <div>
          <label className="block text-yellow-500 text-sm mb-1">Nombre</label>
          <input
            type="text"
            name="name"
            onChange={formik.handleChange}
            value={formik.values.name}
            className="w-full p-2 bg-gray-800 border border-yellow-500/20 rounded"
          />
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-yellow-500 text-sm mb-1">Descripción</label>
          <textarea
            name="description"
            onChange={formik.handleChange}
            value={formik.values.description}
            className="w-full p-2 bg-gray-800 border border-yellow-500/20 rounded"
          />
        </div>

        {/* Precio y Stock */}
        <div className="flex gap-4">
          <div className="w-1/2">
            <label className="block text-yellow-500 text-sm mb-1">Precio</label>
            <input
              type="number"
              name="price"
              onChange={formik.handleChange}
              value={formik.values.price}
              className="w-full p-2 bg-gray-800 border border-yellow-500/20 rounded"
            />
          </div>
          <div className="w-1/2">
            <label className="block text-yellow-500 text-sm mb-1">Stock</label>
            <input
              type="number"
              name="stock"
              onChange={formik.handleChange}
              value={formik.values.stock}
              className="w-full p-2 bg-gray-800 border border-yellow-500/20 rounded"
            />
          </div>
        </div>

        {/* Switch Categoría */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={useExistingCategory}
            onChange={() => setUseExistingCategory(!useExistingCategory)}
            className="accent-yellow-500"
          />
          <label className="text-sm">Usar categoría existente</label>
        </div>

        {/* Selector o Input de categoría */}
        {useExistingCategory ? (
          <div>
            <label className="block text-yellow-500 text-sm mb-1">Seleccionar categoría</label>
            <select
              name="categoryNames"
              onChange={formik.handleChange}
              value={formik.values.categoryNames}
              className="w-full p-2 bg-gray-800 border border-yellow-500/20 rounded"
            >
              <option value="">Seleccionar</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div>
            <label className="block text-yellow-500 text-sm mb-1">Nueva categoría</label>
            <input
              type="text"
              name="newCategory"
              onChange={formik.handleChange}
              value={formik.values.newCategory}
              className="w-full p-2 bg-gray-800 border border-yellow-500/20 rounded"
            />
          </div>
        )}

        {/* Imagen */}
        <div>
          <label className="block text-yellow-500 text-sm mb-1">Imagen</label>
          <input
            type="file"
            name="img"
            accept="image/*"
            onChange={(e) => formik.setFieldValue("img", e.currentTarget.files?.[0])}
            className="w-full text-white p-2 bg-gray-800 border border-yellow-500/20 rounded"
          />
        </div>

        {/* Botón */}
        <button
          type="submit"
          disabled={uploading}
          className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-400 transition"
        >
          {uploading ? "Cargando..." : "Crear Producto"}
        </button>
      </form>
    </div>
  )
}

export default ProductForm
