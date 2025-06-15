"use client"

import { useEffect, useState } from "react"
import { useFormik } from "formik"
import Cookies from "js-cookie"
import { Sparkles } from "lucide-react"

interface Category {
  id: string
  name: string
  isActive: boolean
}

interface ProductFormValues {
  name: string
  description: string
  price: string
  stock: string
  img: File | null
  selectedCategories: string[]
  newCategories: string
}

interface ApiResponse {
  id?: string
  product?: {
    id: string
  }
}

const ProductForm = () => {
  const [uploading, setUploading] = useState<boolean>(false)
  const [message, setMessage] = useState<string>("")
  const [errors, setErrors] = useState<string[]>([])
  const [categories, setCategories] = useState<Category[]>([])

// 🔥 FIX: Parsear correctamente la cookie
const userSession = Cookies.get("userSession")
const token = userSession ? JSON.parse(userSession).token : ""

useEffect(() => {
  const loadCategories = async () => {
    try {
      const res = await fetch("https://arcana-back.onrender.com/categories", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(`Status ${res.status}: ${text}`)
      }

      const data: unknown = await res.json()

      if (!Array.isArray(data)) throw new Error("La respuesta no es un array")

      const loadedCategories = data.filter((item): item is Category =>
        typeof item.id === "string" &&
        typeof item.name === "string" &&
        typeof item.isActive === "boolean"
      )

      setCategories(loadedCategories)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido"
      setMessage(`Error cargando categorías: ${errorMessage}`)
    }
  }

  loadCategories()
}, [token])

  const formik = useFormik<ProductFormValues>({
    initialValues: {
      name: "",
      description: "",
      price: "",
      stock: "",
      img: null,
      selectedCategories: [],
      newCategories: "",
    },
    onSubmit: async (values) => {
      const newErrors: string[] = []

      if (!values.name) newErrors.push("El nombre es requerido.")
      if (!values.description) newErrors.push("La descripción es requerida.")
      if (!values.price || isNaN(Number(values.price))) newErrors.push("El precio debe ser un número.")
      if (!values.stock || isNaN(Number(values.stock))) newErrors.push("El stock debe ser un número.")
      if (!values.img) newErrors.push("La imagen es requerida.")
      if (values.selectedCategories.length === 0 && values.newCategories.trim() === "") {
        newErrors.push("Debes seleccionar o crear al menos una categoría.")
      }

      if (newErrors.length > 0) {
        setErrors(newErrors)
        return
      }

      try {
        setErrors([])
        setUploading(true)
        setMessage("Creando producto...")

        // Process categories
        const finalCategoryNames = [...values.selectedCategories]
        const newCatNames = values.newCategories
          .split(",")
          .map((cat) => cat.trim())
          .filter((cat) => cat !== "")

        // Create new categories if they don't exist
        for (const catName of newCatNames) {
          const alreadyExists = categories.some(
            (cat) => cat.name.toLowerCase() === catName.toLowerCase()
          )
          
          if (!alreadyExists) {
            const catRes = await fetch("https://arcana-back.onrender.com/categories", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ name: catName }),
            })

            if (!catRes.ok) {
              throw new Error(`Error al crear la categoría "${catName}"`)
            }
          }
          finalCategoryNames.push(catName)
        }

        // Create product
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
            categoryNames: finalCategoryNames,
          }),
        })

        if (!productRes.ok) {
          const errorText = await productRes.text()
          throw new Error(`Error al crear producto: ${errorText}`)
        }

        const productData: ApiResponse = await productRes.json()
        const productId = productData.id || productData.product?.id

        if (!productId) throw new Error("No se recibió el ID del producto creado")

        // Upload image
        // Subir imagen
          setMessage("Subiendo imagen...")

          if (!values.img) {
            throw new Error("No se seleccionó ninguna imagen")
          }

          const formData = new FormData()
          formData.append("file", values.img) // Now safe

          const uploadRes = await fetch(
            `https://arcana-back.onrender.com/files/uploadImage/${productId}`,
            {
              method: "POST",
              headers: { Authorization: `Bearer ${token}` },
              body: formData,
            }
          )

        if (!uploadRes.ok) {
          const errorText = await uploadRes.text()
          throw new Error(`Error al subir imagen: ${errorText}`)
        }

        setMessage("✅ Producto creado con éxito.")
        formik.resetForm()
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Error desconocido"
        console.error(errorMessage)
        setMessage(`Error: ${errorMessage}`)
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
        <p className="mb-4 text-sm text-yellow-400 border border-yellow-500/10 rounded p-2">
          {message}
        </p>
      )}

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {/* Name field */}
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

        {/* Description field */}
        <div>
          <label className="block text-yellow-500 text-sm mb-1">Descripción</label>
          <textarea
            name="description"
            onChange={formik.handleChange}
            value={formik.values.description}
            className="w-full p-2 bg-gray-800 border border-yellow-500/20 rounded"
          />
        </div>

        {/* Price and Stock */}
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

        {/* Existing categories */}
        <div>
          <label className="block text-yellow-500 text-sm mb-2">Categorías existentes</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {categories.map((cat) => (
              <label key={cat.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  value={cat.name}
                  checked={formik.values.selectedCategories.includes(cat.name)}
                  onChange={(e) => {
                    const value = e.target.value
                    const selected = formik.values.selectedCategories.includes(value)
                      ? formik.values.selectedCategories.filter((c) => c !== value)
                      : [...formik.values.selectedCategories, value]
                    formik.setFieldValue("selectedCategories", selected)
                  }}
                  className="accent-yellow-500"
                />
                {cat.name}
              </label>
            ))}
          </div>
        </div>

        {/* New categories */}
        <div>
          <label className="block text-yellow-500 text-sm mb-1">
            Nuevas categorías (separadas por coma)
          </label>
          <input
            type="text"
            name="newCategories"
            onChange={formik.handleChange}
            value={formik.values.newCategories}
            className="w-full p-2 bg-gray-800 border border-yellow-500/20 rounded"
            placeholder="Ej: Tarot, Cristales, Energía"
          />
        </div>

        {/* Image upload */}
        <div>
          <label className="block text-yellow-500 text-sm mb-1">Imagen</label>
          <input
            type="file"
            name="img"
            accept="image/*"
            onChange={(e) => formik.setFieldValue("img", e.currentTarget.files?.[0] || null)}
            className="w-full text-white p-2 bg-gray-800 border border-yellow-500/20 rounded"
          />
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-400 transition disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {uploading ? "Cargando..." : "Crear Producto"}
        </button>
      </form>
    </div>
  )
}

export default ProductForm