import mock_products from "@/utils/mock_products";

// Obtener todos los productos simulando una carga asíncrona
export const getProductsDB = async () => {
  return mock_products;
};

// Obtener un producto por su ID, asegurando la conversión de tipo
export const getProductById = async (id: string) => {
  return mock_products.find((p) => p.id === Number(id)) || null;
};