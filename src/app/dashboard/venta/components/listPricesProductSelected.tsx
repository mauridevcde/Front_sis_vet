"use client";
import { Producto } from "@/app/interfaces/productos.interface";
import { Trash } from "lucide-react";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import { useVentaStore } from "../store/storeVenta";
import { InputNumber } from "primereact/inputnumber";
import { useRef } from "react";
import { Toast } from "primereact/toast";

export default function ListPricesProductSelected(producto: Producto) {
  const removeProduct = useVentaStore((state) => state.removeProducto);
  const updateCantidad = useVentaStore((state) => state.updateCantidad);
  const toast = useRef<Toast>(null);

  return (
    <>
      <Toast ref={toast} />
      <div className="flex h-13 items-center justify-between rounded p-2 object-center shadow-md">
        <div className="flex w-[10%] h-10 ">
          <InputNumber
            min={1}
            max={producto.stock}
            mode="decimal"
            useGrouping={false}
            value={producto.cantidad}
            onValueChange={(e) => {
              const ok = updateCantidad(producto.id_producto, e.value ?? 1);

              if (!ok) {
                toast.current?.show({
                  severity: "warn",
                  summary: "Cantidad excedida",
                  detail: `Stock disponible: ${producto.stock}`,
                  life: 3000,
                });
              }
            }}
            inputStyle={{
              padding: "0px",
              fontSize: "0.75rem",
              height: "28px",
              textAlign: "center",
              width: "40px",
            }}
          />
        </div>
        <div className="flex w-[55%] h-10">
          <h1 className="font-semibold text-xs leading-tight overflow-hidden p-1 text-black ">
            {producto.nombre}
          </h1>
        </div>
        <div className="flex w-[20%] h-10">
          <span className="text-xs font-bold self-center ml-3 text-black  ">
            {Intl.NumberFormat("es-ES").format(producto.precio_venta)} Gs.
          </span>
        </div>
        <div className="flex w-[10%] h-10 text-center items-center justify-center">
          <button
            onClick={() => removeProduct(producto.id_producto)}
            className="w-5 h-8  cursor-pointer text-black  transition-colors"
          >
            <Trash />
          </button>
        </div>
      </div>
    </>
  );
}
