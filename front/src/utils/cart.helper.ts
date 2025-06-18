import { ICart, ICartItem, IProduct, ICartUser } from "@/types";

const APIURL = process.env.NEXT_PUBLIC_API_URL;

if (!APIURL) {
  console.error("Advertencia: API URL no está definida. Las solicitudes pueden fallar.");
}

/** Agrega un producto al carrito */
export const addToCartHelper = (cart: ICart, product: IProduct, quantity: number): ICart => {
  const existingItem = cart.items.find(item => item.product.id === product.id);
  if (existingItem) {
    const updatedQuantity = Math.min(existingItem.quantity + quantity, product.stock);
    const updatedItems = cart.items.map(item =>
      item.product.id === product.id ? { ...item, quantity: updatedQuantity } : item
    );
    return { ...cart, items: updatedItems, totalPrice: calculateTotalPrice(updatedItems) };
  }
  const newItem: ICartItem = {
    id: crypto.randomUUID(),
    cart: cart.id,
    product,
    quantity: Math.max(1, quantity)
  };
  const newItems = [...cart.items, newItem];
  return { ...cart, items: newItems, totalPrice: calculateTotalPrice(newItems) };
};

/** Actualiza la cantidad de un producto en el carrito mediante PATCH */
export async function updateCartItemQuantity(itemId: string, quantity: number, token: string): Promise<ICartItem | null> {
  try {
    const response = await fetch(`${APIURL}/cart/items/${itemId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ quantity }),
    });

    if (!response.ok) throw new Error("Error actualizando cantidad");

    return await response.json(); // Devuelve el ítem actualizado
  } catch (error) {
    console.error("Error al actualizar cantidad:", error);
    return null;
  }
}

/** Elimina un producto del carrito mediante DELETE */
export async function deleteCartItem(itemId: string, token: string): Promise<boolean> {
  try {
    const response = await fetch(`${APIURL}/cart/items/${itemId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error(`Error eliminando ítem ${itemId}`);

    return true;
  } catch (error) {
    console.error("Error al eliminar ítem:", error);
    return false;
  }
}

/** Vacía el carrito mediante DELETE /cart */
export async function clearCartDB(token: string): Promise<boolean> {
  try {
    const response = await fetch(`${APIURL}/cart`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Error al vaciar el carrito");

    return true;
  } catch (error) {
    console.error("Error al vaciar el carrito:", error);
    return false;
  }
}

/** Calcula el precio total del carrito */
export const calculateTotalPrice = (items: ICartItem[]): number =>
  items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

/** Guarda el carrito en la base de datos, incluyendo la información del usuario (ICartUser) */
export async function saveCartToDB(cart: ICart, token: string) {
  // Validamos que el usuario esté activo antes de guardar el carrito.
  if (!cart.user.isActive) {
    console.warn("El usuario no está activo. No se guardará el carrito.");
    return { success: false, error: "Usuario inactivo" };
  }
  
  try {
    const response = await fetch(`${APIURL}/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        user: cart.user, // Se envía la información del usuario según ICartUser
        items: cart.items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      }),
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

/** Obtiene el carrito desde la base de datos y adapta su estructura, incluyendo ICartUser */
export async function fetchCartFromDB(token: string): Promise<ICart> {
  try {
    const response = await fetch(`${APIURL}/cart`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Error al obtener el carrito");

    const data = await response.json();
    // Se asegura que la propiedad user cumpla con ICartUser
    if (Array.isArray(data.items)) {
      return {
        id: data.id,
        user: data.user as ICartUser,
        items: (data.items as ICartItem[]).map((item: ICartItem) => ({
          ...item,
          product: item.product ?? {},
        })),
        totalPrice: calculateTotalPrice(data.items as ICartItem[]),
        isActive: data.isActive,
      };
    } else {
      return {
        id: "cart",
        user: { id: "", name: "", email: "", phone: "", address: "", isAdmin: false, isActive: false },
        items: [],
        totalPrice: 0,
        isActive: true,
      };
    }
  } catch (error) {
    console.error("Error al recuperar carrito:", error);
    return {
      id: "cart",
      user: { id: "", name: "", email: "", phone: "", address: "", isAdmin: false, isActive: false },
      items: [],
      totalPrice: 0,
      isActive: true,
    };
  }
}