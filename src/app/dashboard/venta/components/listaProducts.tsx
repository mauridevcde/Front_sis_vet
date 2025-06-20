"use client";

import { useQuery } from "@tanstack/react-query";
import CardsProduct from "./cardsProduct";
import { getAllProductos } from "@/app/_api/productos/getAllProductos";
import { Skeleton } from "primereact/skeleton";
import { useProductStore } from "../store/storeProducts";
import { Producto } from "@/app/interfaces/productos.interface";
import { useEffect, useRef } from "react";

export default function ListaProducts() {
  const filtered = useProductStore((state) => state.filteredProducts);
  const cargaProducto = useProductStore((state) => state.setProducts);


  const { data: productos = [], isPending } = useQuery<Producto[]>({
    queryKey: ["productosVentas"],
    queryFn: getAllProductos,
  });

  useEffect(() => {
    if (productos.length > 0) {
      cargaProducto(productos); // actualiza Zustand cada vez que cambia la data
    }
  }, [productos, cargaProducto]);

  return (
    <div className="flex rounded-2xl flex-col sm:flex-row flex-wrap gap-2 justify-center p-2 h-full overflow-auto">
      {isPending ? (
        <>
          <Skeleton width="10rem" height="4rem" borderRadius="16px"></Skeleton>
          <Skeleton width="10rem" height="4rem" borderRadius="16px"></Skeleton>
          <Skeleton width="10rem" height="4rem" borderRadius="16px"></Skeleton>
          <Skeleton width="10rem" height="4rem" borderRadius="16px"></Skeleton>
          <Skeleton width="10rem" height="4rem" borderRadius="16px"></Skeleton>
          <Skeleton width="10rem" height="4rem" borderRadius="16px"></Skeleton>
          <Skeleton width="10rem" height="4rem" borderRadius="16px"></Skeleton>
          <Skeleton width="10rem" height="4rem" borderRadius="16px"></Skeleton>
          <Skeleton width="10rem" height="4rem" borderRadius="16px"></Skeleton>
          <Skeleton width="10rem" height="4rem" borderRadius="16px"></Skeleton>
          <Skeleton width="10rem" height="4rem" borderRadius="16px"></Skeleton>
          <Skeleton width="10rem" height="4rem" borderRadius="16px"></Skeleton>
          <Skeleton width="10rem" height="4rem" borderRadius="16px"></Skeleton>
          <Skeleton width="10rem" height="4rem" borderRadius="16px"></Skeleton>
          <Skeleton width="10rem" height="4rem" borderRadius="16px"></Skeleton>
          <Skeleton width="10rem" height="4rem" borderRadius="16px"></Skeleton>
          <Skeleton width="10rem" height="4rem" borderRadius="16px"></Skeleton>
          <Skeleton width="10rem" height="4rem" borderRadius="16px"></Skeleton>
          <Skeleton width="10rem" height="4rem" borderRadius="16px"></Skeleton>
          <Skeleton width="10rem" height="4rem" borderRadius="16px"></Skeleton>
          <Skeleton width="10rem" height="4rem" borderRadius="16px"></Skeleton>
        </>
      ) : (
        filtered.map((producto) => (
          <CardsProduct key={producto.id_producto} {...producto} />
        ))
      )}
    </div>
  );
}
