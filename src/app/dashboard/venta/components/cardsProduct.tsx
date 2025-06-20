"use client";

import { Producto } from "@/app/interfaces/productos.interface";
import { obtenerIndiceAleatorio } from "../utils/colorsRandom";
import { useVentaStore } from "../store/storeVenta";
import { Badge } from "primereact/badge";
import { Toast } from "primereact/toast";
import { useRef } from "react";

export default function CardsProduct(producto: Producto) {
  const aggProductStore = useVentaStore((state) => state.addProducto);
  const calcularTotales = useVentaStore((state) => state.calcularTotales);
  const toast = useRef<Toast>(null);

  const handleAgregar = () => {
    const ok = aggProductStore(producto);

    if (!ok) {
      toast.current?.show({
        severity: "warn",
        summary: "Stock insuficiente",
        detail: `No hay más stock para ${producto.nombre}`,
        life: 3000,
      });
    }
  };
  const getStockSeverity = () => {
    if (producto.stock === 0) return "danger";
    if (producto.stock <= 5) return "warning";
    return "success";
  };
  return (
    <>
      <Toast ref={toast} />
      <div
        onClick={() => {
          handleAgregar();
          calcularTotales();
        }}
        className="flex h-50 w-50 overflow-clip cursor-pointer flex-wrap shadow-xl rounded-sm hover:scale-102 relative"
      >
        <Badge
          className="absolute top-0 right-0 z-10"
          value={producto.stock}
          severity={getStockSeverity()}
        ></Badge>
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
    </>
  );
}
