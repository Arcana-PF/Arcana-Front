
import { IProduct } from "@/types";

const mock_products: IProduct [] = [{
  // Este archivo contiene un mock de productos para la tienda online
  // Cada producto tiene un id, nombre, descripcion, precio, stock, url de imagen y categoria
  // Puedes agregar o modificar productos según sea necesario
  // Recuerda que este es solo un mock y no se guardará en una base de datos real
      "id": 1,
      "name": "Vela de Purificacion",
      "description": "Ideal para rituales y purificacion del ambiente.",
      "price": 1181,
      "stock": 38,
      "imgUrl": "https://cividinzen.com.ar/wp-content/uploads/2023/01/Diseno-sin-titulo-82.jpg",
      "category": "Velas"
    },
    {
      "id": 2,
      "name": "Vela Aromatica",
      "description": "Ideal para rituales y purificacion del ambiente.",
      "price": 1807.90,
      "stock": 31,
      "imgUrl": "https://alparamis.com.ar/456155-superlarge_default/vela-de-soja-aromatica-250-g-linea-clasica-pomelo-espacio-aroma.jpg",
      "category": "Velas"
    },
    {
      "id": 3,
      "name": "Vela Blanca Ritual",
      "description": "Ideal para rituales y purificaci\u00f3n del ambiente.",
      "price": 1198.63,
      "stock": 46,
      "imgUrl": "https://antevasinstore.com/cdn/shop/files/EBF59FB3-FFD8-4271-A4C0-613147A69520.jpg",
      "category": "Velas"
    },
    {
      "id": 4,
      "name": "Vela de Canela",
      "description": "Ideal para rituales y purificacion del ambiente.",
      "price": 2780.21,
      "stock": 24,
      "imgUrl": "https://www.regalospublicitarios.com/recursos/CIFRA/img/CF10657/descriptivas/10657-AZ-02-500x500.jpg",
      "category": "Velas"
    },
    {
      "id": 5,
      "name": "Vela de Miel",
      "description": "Ideal para rituales y purificaci\u00f3n del ambiente.",
      "price": 535.92,
      "stock": 26,
      "imgUrl": "https://www.delishop.com.uy/wp-content/uploads/sites/35/2024/08/vela-larga-1.png",
      "category": "Velas"
    },
    {
      "id": 6,
      "name": "Sahumerio de Lavanda",
      "description": "Perfecto para limpiar energias y meditar.",
      "price": 1835,
      "stock": 26,
      "imgUrl": "https://acdn-us.mitiendanube.com/stores/004/536/504/products/lavanda-74a5474f0bc7b2bedd17237334750064-1024-1024.jpg",
      "category": "Sahumerios"
    },
    {
      "id": 7,
      "name": "Sahumerio de Ruda",
      "description": "Perfecto para limpiar energias y meditar.",
      "price": 2963,
      "stock": 20,
      "imgUrl": "https://hudamar.com.ar/wp-content/uploads/2023/08/palo-santo-ruda-scaled.jpeg",
      "category": "Sahumerios"
    },
    {
      "id": 8,
      "name": "Sahumerio de Copal",
      "description": "Perfecto para limpiar energias y meditar.",
      "price": 1064,
      "stock": 39,
      "imgUrl": "https://saphirus.com.ar/wp-content/uploads/2022/08/ambar-sahumerios-copal-3.jpg",
      "category": "Sahumerios"
    },
    {
      "id": 9,
      "name": "Sahumerio de Palo Santo",
      "description": "Perfecto para limpiar energias y meditar.",
      "price": 2227,
      "stock": 38,
      "imgUrl": "https://revendersagradamadre.com.ar/wp-content/uploads/2025/01/palo-santo-salvia.jpg",
      "category": "Sahumerios"
    },
    {
      "id": 10,
      "name": "Cuarzo Rosa",
      "description": "Piedras energeticas con propiedades especificas.",
      "price": 2226,
      "stock": 45,
      "imgUrl": "https://sahumeriosomali.com.ar/wp-content/uploads/2021/11/WhatsApp-Image-2021-11-27-at-13.28.45.jpeg",
      "category": "Cristales"
    },
    {
      "id": 11,
      "name": "Amatista",
      "description": "Piedras energeticas con propiedades especificas.",
      "price": 1569,
      "stock": 30,
      "imgUrl": "https://victorgemas.com.ar/wp-content/uploads/2023/04/Piedra-rolada-suelta-amatista.jpg",
      "category": "Cristales"
    },
    {
      "id": 12,
      "name": "Obsidiana",
      "description": "Piedras energeticas con propiedades especificas.",
      "price": 2948.9,
      "stock": 17,
      "imgUrl": "https://s.alicdn.com/@sc04/kf/Uba85e658247a494fad63476dc61f4241T.jpg_720x720q50.jpg",
      "category": "Cristales"
    },
    {
      "id": 13,
      "name": "Citrino",
      "description": "Piedras energeticas con propiedades especificas.",
      "price": 1482.26,
      "stock": 49,
      "imgUrl": "https://rockidentifier.com/wiki-image/1080/154238799696625690.jpeg",
      "category": "Cristales"
    },
    {
      "id": 14,
      "name": "Turmalina Negra",
      "description": "Piedras energeticas con propiedades especificas.",
      "price": 1227.45,
      "stock": 20,
      "imgUrl": "https://www.gemascanarias.com/img/cms/turmalina-negra-en-bruto.jpg",
      "category": "Cristales"
    },
    {
      "id": 15,
      "name": "Buda Meditador",
      "description": "Representaciones sagradas para atraer energia.",
      "price": 2890.64,
      "stock": 5,
      "imgUrl": "https://www.mobelfy.com/63105-large_default/figura-de-buda-sentado.jpg",
      "category": "Estatuillas"
    },
    {
      "id": 16,
      "name": "Ganesha",
      "description": "Representaciones sagradas para atraer energia.",
      "price": 1197.43,
      "stock": 28,
      "imgUrl": "https://acdn-us.mitiendanube.com/stores/972/074/products/elefante1-87a9da6f6281f226fb15916407810778-1024-1024.jpg",
      "category": "Estatuillas"
    },
    {
      "id": 17,
      "name": "Estatua de Anubis",
      "description": "Representaciones sagradas para atraer energia.",
      "price": 1248.68,
      "stock": 32,
      "imgUrl": "https://m.media-amazon.com/images/I/41TZRi0Mi-L._AC_US750_.jpg",
      "category": "Estatuillas"
    },
    {
      "id": 18,
      "name": "Fenix de Resina",
      "description": "Representaciones sagradas para atraer energia.",
      "price": 1125.21,
      "stock": 27,
      "imgUrl": "https://m.media-amazon.com/images/I/71gdHvnMFXL.jpg",
      "category": "Estatuillas"
    },
    {
      "id": 19,
      "name": "Amuleto de Proteccion",
      "description": "Accesorios protectores con significado espiritual.",
      "price": 1086.75,
      "stock": 19,
      "imgUrl": "https://laminadeplata.com/wp-content/uploads/2018/09/tetragramat%C3%B3n-300x300.jpg",
      "category": "Amuletos"
    },
    {
      "id": 20,
      "name": "Ojo Turco",
      "description": "Accesorios protectores con significado espiritual.",
      "price": 1272.86,
      "stock": 26,
      "imgUrl": "https://laminadeplata.com/wp-content/uploads/2024/04/colgante-simbolo-ojo-turco-1-300x300.jpg",
      "category": "Amuletos"
    },
    {
      "id": 21,
      "name": "Pentaculo de Plata",
      "description": "Accesorios protectores con significado espiritual.",
      "price": 2323.12,
      "stock": 8,
      "imgUrl": "https://m.media-amazon.com/images/I/81LiqQP5mCL._AC_UY1000_.jpg",
      "category": "Amuletos"
    },
    {
      "id": 22,
      "name": "Mano de Fatima",
      "description": "Accesorios protectores con significado espiritual.",
      "price": 1650.11,
      "stock": 19,
      "imgUrl": "https://cristaljoyas.com/media/catalog/product/cache/f06412bcaeffb4364662cfc53d14e291/b/v/bvodi-g538.jpg",
      "category": "Amuletos"
    }
]
export default mock_products;
