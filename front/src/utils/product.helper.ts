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

export async function getProductById(id: string): Promise<IProduct> {
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