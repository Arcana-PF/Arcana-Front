import React from "react";
import Card from "./Card";
import mock_products from "@/utils/mock_products";
import Link from "next/link";

const CardList = () => {
  return (
    <div className="flex flex-wrap items-center gap-4 p-4 justify-center">
      {mock_products.map((product) => (
          <Link key={product.id} href={`/product/${product.id}`}>
            <Card {...product} />
          </Link>
        ))}
    </div>
  );
};

export default CardList;