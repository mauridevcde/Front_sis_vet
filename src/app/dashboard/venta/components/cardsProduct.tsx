"use client";

import { Producto } from "@/app/interfaces/productos.interface";
import { obtenerIndiceAleatorio } from "../utils/colorsRandom";
import { useVentaStore } from "../store/storeVenta";

export default function CardsProduct(producto: Producto) {
  const aggProductStore = useVentaStore((state) => state.addProducto);
  const calcularTotales = useVentaStore((state) => state.calcularTotales);

  return (
    <div
      onClick={() => {
        aggProductStore(producto);
        calcularTotales();
      }}
      className="flex h-50 w-50 overflow-clip cursor-pointer flex-wrap shadow-xl rounded-sm hover:bg-sky-700 hover:scale-102"
    >
      <img
        className="flex w-screen h-[70%] object-cover transition-transform duration-300"
        src={producto.imagen}
      ></img>

      <div
        className="flex w-screen h-[30%] flex-wrap"
        style={{ backgroundColor: obtenerIndiceAleatorio().toString() }}
      >
        <h1 className="font-semibold text-xs leading-tight overflow-hidden p-1 text-white ">
          {producto.nombre}
        </h1>
        <span className="text-sm font-bold self-center ml-3 text-white  ">
          {Intl.NumberFormat("es-ES").format(producto.precio_venta)} Gs.
        </span>
      </div>
    </div>
  );
}
