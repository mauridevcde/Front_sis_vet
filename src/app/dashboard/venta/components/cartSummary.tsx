import React, { useRef } from "react";
import { useVentaStore } from "../store/storeVenta";
import { Button } from "primereact/button";
import { useAuthStore } from "@/app/_store/authStore";
import { formatToLocalSqlDatetime } from "@/app/utils/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Toast } from "primereact/toast";
import { postVentas } from "@/app/_api/ventas/postVentas";
import { DetalleVenta } from "@/app/interfaces/venta/detalle_ventas.interface";
import { Venta } from "@/app/interfaces/venta/venta.interface";
import { VentaCompleta } from "@/app/interfaces/venta/ventaCompleta.interface";
import { generarPDFVenta } from "./ticket_de_venta/ticketDeVenta";

export default function CartSummary() {
  const subTotal = useVentaStore((state) => state.subTotal);
  const iva10 = useVentaStore((state) => state.iva10);
  const total = useVentaStore((state) => state.Total);
  const productos = useVentaStore((state) => state.productos);
  const id_cliente = useVentaStore((state) => state.cliente);
  const clearVenta = useVentaStore((state) => state.clearVenta);
  const { id_usuario } = useAuthStore() as { id_usuario: number };
  const queryClient = useQueryClient();
  const toast = useRef<Toast>(null);

  const mutationNewVenta = useMutation({
    mutationFn: async (data: VentaCompleta): Promise<{ id_venta: number }> => {
      const response = await postVentas(data);
      // Suponiendo que el id_venta está en response.data.id_venta
      return { id_venta: response.data.id_venta };
    },
    onSuccess: (response: { id_venta: number }) => {
      const ventaConId = { ...venta, id_venta: response.id_venta };
      generarPDFVenta(ventaConId, detalles, {
        efectivo: venta.total,
        cambio: 0,
      });

      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: "Venta realizada con éxito!",
        life: 3000,
      });

      queryClient.invalidateQueries({ queryKey: ["productosVentas"] });
      clearVenta();
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
  const detalles: DetalleVenta[] = productos.map((value) => {
    return {
      id_producto: value.id_producto,
      id_usuario: id_usuario,
      cantidad: value.cantidad ?? 0,
      precio_unitario: Math.floor(value.precio_venta),
      subtotal: Math.floor(value.precio_venta * (value.cantidad ?? 0)),
      estado: 1,
      iva: Math.floor(value.precio_venta / 11),
    };
  });
  const venta: Venta = {
    id_cliente:
      id_cliente && typeof id_cliente === "object" && "id_cliente" in id_cliente
        ? (id_cliente as any).id_cliente
        : typeof id_cliente === "number"
        ? id_cliente
        : 0,
    id_usuario: id_usuario,
    fecha_venta: formatToLocalSqlDatetime(new Date()),
    total: Math.floor(total),
    estado: "pagada",
    tipo_pago: "efectivo",
    tipo_venta: "contado",
    subTotal: Math.floor(subTotal),
    Iva0: 0,
    Iva5: 0,
    Iva10: Math.floor(iva10),
    TotalDescuento: 0,
    id_caja: "0",
  };
  const dataParaVenta: VentaCompleta = {
    venta,
    detalles,
  };
  const ejecutarVenta = () => {
    if (id_cliente?.id_cliente == null || id_cliente.id_cliente == undefined) {
      console.log("No existe cliente!");
      toast.current?.show({
        severity: "warn",
        summary: "Seleccione el cliente!",
        life: 1500,
      });
      return;
    }

    if (productos.length <= 0) {
      toast.current?.show({
        severity: "info",
        summary: "Seleccione al menos 1 producto!",
        life: 1500,
      });
      return;
    }

    mutationNewVenta.mutate(dataParaVenta);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-3 w-full max-w-md mx-auto">
      <Toast ref={toast} />
      {/* Resumen de items */}
      <div className="border-b border-gray-200 pb-3 mb-3">
        <p className="font-medium text-gray-700">{productos.length} items</p>
        <div className="flex justify-between mt-1">
          <span className="text-gray-600">Subtotal:</span>
          <span className="font-medium">
            {Intl.NumberFormat("es-ES").format(subTotal)} Gs.
          </span>
        </div>
      </div>

      {/* Descuento */}
      <div className="border-b border-gray-200 pb-3 mb-2">
        <div className="flex justify-between items-center">
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            Iva:
          </button>
          <div className="flex items-center">
            <span className="text-black">
              {Intl.NumberFormat("es-ES").format(iva10)}
            </span>
          </div>
        </div>
      </div>

      {/* Total */}
      <div className="mb-2">
        <div className="flex justify-between font-bold text-lg">
          <span>Total:</span>
          <span>{Intl.NumberFormat("es-ES").format(total)}</span>
        </div>
      </div>

      {/* Botón de pago */}

      <div className="flex justify-around items-center">
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          severity="secondary"
          aria-label="Cancelar Venta"
          onClick={() => clearVenta()}
        ></Button>
        <Button
          disabled={productos.length === 0 || mutationNewVenta.isPending}
          label="Vender"
          severity="success"
          className="w-[60%]"
          style={{ display: "flex", alignItems: "center" }}
          onClick={() => ejecutarVenta()}
        ></Button>
      </div>
    </div>
  );
}
