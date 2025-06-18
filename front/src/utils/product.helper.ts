import { IProduct } from "@/types";

const APIURL = process.env.NEXT_PUBLIC_API_URL;

export async function getProductsDB(): Promise<IProduct[]> {
    try {
        const response = await fetch(`${APIURL}/products`);

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error al obtener productos:", error);
        throw new Error("No se pudieron obtener los productos.");
    }
}

export async function getProductsById(id: string): Promise<IProduct> {
    try {
        const response = await fetch(`${APIURL}/products/${id}`);

        if (!response.ok) {
            throw new Error(`Producto no encontrado: Error ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error al obtener el producto con ID ${id}:`, error);
        throw new Error(`No se pudo obtener el producto con ID ${id}.`);
    }
}

export async function toggleProductVisibility(productId: string, isActive: boolean, token: string): Promise<boolean> {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ isActive }),
        });

        if (!response.ok) {
            const errorMsg = await response.text();
            console.error(`Error actualizando visibilidad del producto: ${errorMsg}`);
            return false;
        }

        return true;
    } catch (error) {
        console.error("Error inesperado en toggleProductVisibility:", error);
        return false;
    }
}