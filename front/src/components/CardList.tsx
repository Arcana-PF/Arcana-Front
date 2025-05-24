import React from "react";
import Card from "./Card";
import mock_products from "@/utils/mock_products";


const CardList = () => {
    const products = mock_products
    return(
        <>
        {
            products &&
            products?.map((product) => {
                return (
                <Card key={product.id} product={product} />
            )
        })
        }
        </>
    )
}
export default CardList