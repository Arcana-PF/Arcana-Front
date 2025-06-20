// app/products/[productID]/page.tsx

import ProductDetail from "@/components/ui/ProductDetail";
import { getProductsById } from "@/utils/product.helper";

interface Params {
  productID: string;
}

const DetailProduct = async ({
  params,
}: {
  params: Promise<Params>;
}) => {
  const { productID } = await params;

  try {
    const product = await getProductsById(productID);
    return (
      <div className="min-h-screen w-full">
        <ProductDetail {...product} />
      </div>
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Ha ocurrido un error desconocido";

    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <p className="text-red-500 text-lg">{errorMessage}</p>
      </div>
    );
  }
};

export default DetailProduct;