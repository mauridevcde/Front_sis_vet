"use client";
import { formatToLocalSqlDatetime } from "@/app/utils/utils";
import { Button } from "primereact/button";
import { useCompraStore } from "../store/compraStore";
import { useAuthStore } from "@/app/_store/authStore";
import { InputNumber } from "primereact/inputnumber";
import { useRef } from "react";
import { Toast } from "primereact/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postCompra } from "@/app/_api/compras/postCompras";

export default function ResultadoDetalles() {
  const subTotal = useCompraStore((state) => state.subtotal);
  const Total = useCompraStore((state) => state.total);
  const Iva10 = useCompraStore((state) => state.iva);
  const proveedor = useCompraStore((state) => state.proveedor);
  const producto = useCompraStore((state) => state.productos);
  const nroFactura = useCompraStore((state) => state.nroFactura);
  const limpiarCompra = useCompraStore((state) => state.clearCompra);
  const { id_usuario } = useAuthStore() as { id_usuario: number };
  const toast = useRef<Toast>(null);
  const queryClient = useQueryClient();

  const mutationNewCompra = useMutation({
    mutationFn: postCompra,
    onSuccess: () => {
      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: "Compra realizada con exito, verifica el stock del producto!",
        life: 3000,
      }); 
      queryClient.invalidateQueries({ queryKey: ["productos"] });
      limpiarCompra();
    },
    onError: (error: any) => {
      toast.current?.show({
        severity: "error",
        summary: "No se realizo la compra!",
        detail: error.message,
        life: 2000,
      });
    },
  });

  const ejecutarCompra = () => {
    if (
      proveedor?.id_proveedor == null ||
      proveedor.id_proveedor == undefined
    ) {
      console.log("no existe proveedor");
      toast.current?.show({
        severity: "warn",
        summary: "Seleccione el proveedor!",
        life: 1500,
      });
      return;
    }
    if (nroFactura == "" || nroFactura == null || nroFactura == undefined) {
      console.log("no existe proveedor");
      toast.current?.show({
        severity: "warn",
        summary: "Agregar el N° Factura!",
        life: 1500,
      });
      return;
    }
    if (producto.length <= 0) {
      console.log("no existen productos");

      toast.current?.show({
        severity: "info",
        summary: "Seleccione al menos 1 producto!",
        life: 1500,
      });
      return;
    }

    const Detalle_compra = producto.map((value) => {
      return {
        id_producto: value.id_producto,
        id_usuario: id_usuario,
        cantidad: value.cantidad,
        costo: Math.floor(value.precio_compra),
        subtotal: Math.floor(value.precio_compra * value.cantidad),
        iva: Math.floor(Iva10),
        CostoMedio: Math.floor(value.precio_compra),
      };
    });

    const dataParaCompra = {
      compra: {
        id_proveedor: proveedor?.id_proveedor,
        id_usuario: id_usuario,
        estado: "recibida",
        fecha_compra: formatToLocalSqlDatetime(new Date()),
        FacturaNro: nroFactura.trim(),
        TipoDeCompra: "Contado",
        Iva0: 0,
        Iva5: 0,
        Iva10: Math.floor(Iva10),
        SubTotal: Math.floor(subTotal),
        TotalNeto: Math.floor(Total),
      },
      detalles: Detalle_compra,
    };
    mutationNewCompra.mutate(dataParaCompra);
  };

  return (
    <div className="flex p-2 h-[100%] flex-wrap align-middle">
      <Toast ref={toast} />
      {/* ----------seccion 1------------- */}
      <div className="flex-1/2   ">
        <div className="flex w-[100%] h-[33%] justify-center items-center">
          <span className="text-sm opacity-80 mt-1">SubTotal:</span>
          <InputNumber
            mode="decimal"
            value={subTotal}
            disabled
            className="p-inputtext-sm"
            style={{
              width: "190px",
              height: "30px",
              marginLeft: "5px",
            }}
          />
        </div>

        <div className="flex w-[100%] h-[33%] justify-center items-center">
          <span className="text-sm opacity-80 mt-1">Iva 10%:</span>
          <InputNumber
            mode="decimal"
            value={Math.floor(Iva10)}
            disabled
            className="p-inputtext-sm"
            style={{
              width: "190px",
              height: "30px",
              marginLeft: "5px",
            }}
          />
        </div>
        <div className="flex w-[100%]  h-[33%] justify-center items-center">
          <span className="text-sm font-bold text-red-800 ">TOTAL :</span>
          <InputNumber
            mode="decimal"
            value={Math.floor(Total)}
            disabled
            className="p-inputtext-sm"
            style={{
              width: "190px",
              height: "30px",
              marginLeft: "5px",
            }}
          />
        </div>

        {/* ----------seccion 2------------ */}
      </div>
      <div className="flex p-2 gap-2 justify-center items-center w-[100%]">
        <div className="">
          <Button
            label="CANCELAR COMPRA"
            severity="danger"
            size="small"
            className="text-xs p-2"
            onClick={() => limpiarCompra()}
          ></Button>
        </div>
        <div className="">
          <Button
            label="CONFIRMAR COMPRA"
            severity="success"
            size="small"
            className="text-xs p-2"
            onClick={() => {
              ejecutarCompra();
            }}
          ></Button>
        </div>
      </div>
    </div>
  );
}
