import { IProduct, ICart } from "@/types";

const APIURL = process.env.NEXT_PUBLIC_API_URL;

if (!APIURL) {
  throw new Error("API URL is not defined");
}

/** Agrega un producto al carrito */
export const addToCartHelper = (cart: ICart, product: IProduct, quantity: number): ICart => {
  const existingItem = cart.products.find((item) => item.id === product.id);

  if (existingItem) {
    const updatedQuantity = Math.min((existingItem.quantity ?? 1) + quantity, product.stock); // ✅ Asegura que quantity tenga un valor
    return {
      ...cart,
      products: cart.products.map((item) =>
        item.id === product.id ? { ...item, quantity: updatedQuantity } : item
      ),
      totalPrice: calculateTotalPrice(cart.products),
    };
  }

  return {
    ...cart,
    products: [...cart.products, { ...product, quantity: Math.max(1, quantity) }], // ✅ Si quantity es undefined, usa 1
    totalPrice: calculateTotalPrice([...cart.products, { ...product, quantity: Math.max(1, quantity) }]),
  };
};

/** Elimina un producto del carrito */
export const removeFromCartHelper = (cart: ICart, productId: string): ICart => ({
  ...cart,
  products: cart.products.filter((item) => item.id !== productId),
  totalPrice: calculateTotalPrice(cart.products.filter((item) => item.id !== productId)),
});

/** Actualiza la cantidad de un producto en el carrito */
export const updateCartQuantityHelper = (cart: ICart, productId: string, quantity: number): ICart => ({
  ...cart,
  products: cart.products.map((item) =>
    item.id === productId
      ? { ...item, quantity: Math.max(1, Math.min(quantity, item.stock ?? 1)) } // ✅ Garantiza que quantity tenga un valor válido
      : item
  ),
  totalPrice: calculateTotalPrice(cart.products),
});

/** Vacía el carrito */
export const clearCartHelper = (): ICart => ({
  id: "cart-1",
  products: [],
  quantity: 0,
  priceAtPurchase: 0,
  totalPrice: 0,
});

/** Calcula el precio total del carrito */
export const calculateTotalPrice = (products: IProduct[]): number =>
  products.reduce((acc, item) => acc + item.price * (item.quantity ?? 1), 0);

/** Guarda el carrito en la base de datos */
export async function saveCartToDB(cart: IProduct[], token: string) {
  try {
    const response = await fetch(`${APIURL}/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ products: cart }),
    });

    if (!response.ok) {
      const errorMessage = await response.json().catch(() => "Error desconocido");
      console.error("Error al guardar carrito:", errorMessage);
      return { success: false, error: errorMessage };
    }

    return { success: true };
  } catch (error) {
    console.error("Error inesperado:", error);
    return { success: false, error: error instanceof Error ? error.message : "Error desconocido" };
  }
}

/** Obtiene el carrito desde la base de datos */
export async function fetchCartFromDB(userId: number, token: string) {
  try {
    const response = await fetch(`${APIURL}/cart?userId=${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error("Error al obtener el carrito");
    }

    return await response.json();
  } catch (error) {
    console.error("Error al recuperar carrito:", error);
    return null;
  }
}

/** Convierte el carrito en una orden */
export async function createOrderFromCart(cart: IProduct[], token: string) {
  try {
    const response = await fetch(`${APIURL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ products: cart.map((p) => ({ id: p.id, quantity: p.quantity })) }),
    });

    if (!response.ok) {
      const errorMessage = await response.json().catch(() => "Error desconocido");
      console.error("Error al crear pedido:", errorMessage);
      return { success: false, error: errorMessage };
    }

    return { success: true };
  } catch (error) {
    console.error("Error inesperado en pedido:", error);
    return { success: false, error: error instanceof Error ? error.message : "Error desconocido" };
  }
}