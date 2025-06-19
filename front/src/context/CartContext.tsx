"use client"

import { createContext, useContext, useEffect, useState, useCallback, useMemo, type ReactNode } from "react"
import { usePathname } from "next/navigation"
import type { ICart, IProduct, ICartUser } from "@/types"
import { useAuth } from "@/context/AuthContext"
import {
  addToCartHelper,
  updateCartItemQuantity,
  deleteCartItem,
  clearCartDB,
  fetchCartFromDB,
} from "@/utils/cart.helper"

export interface CartContextType {
  cart: ICart
  addToCart: (product: IProduct) => void
  removeFromCart: (itemId: string) => void
  clearCart: () => void
  updateCartQuantity: (itemId: string, quantity: number) => void
  totalPrice: number
  isCartReady: boolean
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const useCart = (): CartContextType => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart debe usarse dentro de CartProvider")
  return ctx
}

const initialCart: ICart = {
  id: "cart-1",
  user: {
    id: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    isAdmin: false,
    isActive: false,
  },
  items: [],
  totalPrice: 0,
  isActive: true,
}

// Función helper para disparar eventos de actualización del carrito
const dispatchCartUpdate = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("cartUpdated"))
  }
}

// Función helper para convertir el usuario de IUserSession a ICartUser
const convertUserToCartUser = (user: any): ICartUser => {
  return {
    id: user.id.toString(), // Convertir number a string
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    isAdmin: user.isAdmin,
    isActive: true, // Asumimos que está activo si está logueado
  }
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { userData, isUserReady } = useAuth()
  const pathname = usePathname()

  const [cart, setCart] = useState<ICart>(initialCart)
  const [isCartReady, setIsCartReady] = useState(false)

  // Función para refrescar el carrito desde el servidor
  const refreshCart = useCallback(async () => {
    if (!userData?.user?.id || !userData?.token) {
      setCart(initialCart)
      setIsCartReady(true)
      return
    }

    try {
      const storedCart = await fetchCartFromDB(userData.token)
      const cartUser = convertUserToCartUser(userData.user)
      setCart(storedCart || { ...initialCart, user: cartUser })
      dispatchCartUpdate() // Disparar evento de actualización
    } catch (error) {
      console.error("Error refreshing cart:", error)
      const cartUser = convertUserToCartUser(userData.user)
      setCart({ ...initialCart, user: cartUser })
    } finally {
      setIsCartReady(true)
    }
  }, [userData?.token, userData?.user])

  // Carga inicial y revalidación en cada cambio de ruta
  useEffect(() => {
    if (!isUserReady) return
    refreshCart()
  }, [isUserReady, pathname, userData?.token, refreshCart])

  // Suma total calculada
  const totalPrice = useMemo(
    () => cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [cart.items],
  )

  // Agregar producto
  const addToCart = useCallback(
    async (product: IProduct) => {
      if (!userData?.token || !userData?.user?.id) {
        console.warn("No se puede agregar al carrito: usuario no autenticado")
        return
      }

      try {
        const newCart = addToCartHelper(cart, product, 1)
        setCart(newCart)
        dispatchCartUpdate() // Disparar evento de actualización
        console.log("Producto agregado al carrito:", product.name)
      } catch (error) {
        console.error("Error adding to cart:", error)
      }
    },
    [userData?.token, userData?.user?.id, cart],
  )

  // Actualizar cantidad con optimistic update + rollback/refetch
  const updateCartQuantity = useCallback(
    async (itemId: string, newQuantity: number) => {
      if (!userData?.token) return

      // 1) Hacemos una copia del estado actual para rollback
      const snapshot = JSON.parse(JSON.stringify(cart))

      // 2) Optimistic update: aplicamos la UI inmediatamente
      setCart((prev) => ({
        ...prev,
        items: prev.items.map((it) => (it.id === itemId ? { ...it, quantity: newQuantity } : it)),
      }))

      dispatchCartUpdate() // Disparar evento de actualización

      try {
        // 3) Enviamos petición al backend
        const updated = await updateCartItemQuantity(itemId, newQuantity, userData.token)

        // 4) Confirmamos o usamos fallback
        const confirmedQty = updated && typeof updated.quantity === "number" ? updated.quantity : newQuantity

        setCart((prev) => ({
          ...prev,
          items: prev.items.map((it) => (it.id === itemId ? { ...it, quantity: confirmedQty } : it)),
        }))

        dispatchCartUpdate() // Disparar evento de actualización
      } catch (err) {
        console.error("Error actualizando cantidad:", err)

        // 5) En caso de fallo, recargamos el carrito del servidor
        try {
          const fresh = await fetchCartFromDB(userData.token)
          const cartUser = convertUserToCartUser(userData.user)
          setCart(fresh || { ...initialCart, user: cartUser })
          dispatchCartUpdate() // Disparar evento de actualización
        } catch {
          // Si el refetch también falla, revertimos al snapshot
          setCart(snapshot)
          dispatchCartUpdate() // Disparar evento de actualización
        }
      }
    },
    [userData, cart],
  )

  // Eliminar item
  const removeFromCart = useCallback(
    async (itemId: string) => {
      if (!userData?.token) return

      try {
        const ok = await deleteCartItem(itemId, userData.token)
        if (!ok) return

        setCart((prev) => ({
          ...prev,
          items: prev.items.filter((it) => it.id !== itemId),
        }))

        dispatchCartUpdate() // Disparar evento de actualización
        console.log("Item removido del carrito:", itemId)
      } catch (error) {
        console.error("Error removing item from cart:", error)
      }
    },
    [userData?.token],
  )

  // Vaciar carrito
  const clearCart = useCallback(async () => {
    if (!userData?.token) return

    try {
      const ok = await clearCartDB(userData.token)
      if (!ok) return

      setCart((prev) => ({ ...prev, items: [], totalPrice: 0 }))
      dispatchCartUpdate() // Disparar evento de actualización
      console.log("Carrito vaciado")
    } catch (error) {
      console.error("Error clearing cart:", error)
    }
  }, [userData?.token])

  // Efecto para sincronizar con localStorage (opcional, si también usas localStorage)
  useEffect(() => {
    if (typeof window !== "undefined" && isCartReady && userData?.user?.id && cart.items.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart))
    } else if (typeof window !== "undefined" && !userData?.user?.id) {
      localStorage.removeItem("cart")
    }
  }, [cart, isCartReady, userData?.user?.id])

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        updateCartQuantity,
        totalPrice,
        isCartReady,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
