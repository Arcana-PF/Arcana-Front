import mock_products from "./mock_products";

export const getProductsDB = async () => {
  return mock_products;
};

// Obtener un producto por su ID, asegurando que siempre tenga valores válidos
export const getProductById = async (id: string) => {
  const product = mock_products.find((p) => Number(p.id) === Number(id));

  return product ?? {
    id: 0, // Valor por defecto para evitar errores
    name: "Producto no encontrado",
    description: "Sin descripción",
    price: 0,
    stock: 0,
    imgUrl: "default.jpg",
    category: "Sin categoría",
  };
};