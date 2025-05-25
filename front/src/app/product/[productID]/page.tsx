import ProductDetail from "@/components/ui/ProductDetail";
import { getProductById } from "@/utils/product.helper";



const DetailProduct = async ({params} : {params: Promise<{productID: string}>}) => {
  const productID = (await params).productID
  const product = await getProductById(productID)
    return(
      <div className="min-h-screen flex flex-col items-center justify-center">
        <ProductDetail{...product} />
    </div>
    )
}

export default DetailProduct;