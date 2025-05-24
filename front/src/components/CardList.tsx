import React from "react";
import Card from "./Card";
import mock_products from "@/utils/mock_products";


const CardList = () => {
    const products = mock_products
    return(
        <div  className="flex flex-wrap items-center gap-4 p-4 justify-center">
        {
            products &&
            products?.map((product) => {
                return (
                <Card key={product.id} product={product} />
            )
        })
        }
        </div>
    )
}
export default CardList