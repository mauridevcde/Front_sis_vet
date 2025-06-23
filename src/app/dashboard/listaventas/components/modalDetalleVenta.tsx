"use client";

import { useQuery } from "@tanstack/react-query";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { useDetalleVentaStore } from "../store/detalleVentaStore";
import { getDetalleByIdVenta } from "@/app/_api/ventas/getDetalleByIdVenta";

export default function ModalDetalleVenta() {
  const idVenta = useDetalleVentaStore((state) => state.idVenta);
  const openModal = useDetalleVentaStore((state) => state.openModalDetalles);
  const setOpenModal = useDetalleVentaStore(
    (state) => state.setOpenModalDetalles
  );

  const useDetalleVentasById = (id: number) => {
    return useQuery({
      queryKey: ["getDetalleByIdVenta", id],
      queryFn: () => getDetalleByIdVenta(id),
      enabled: !!id,
    });
  };

  const { data: datosDetalles } = useDetalleVentasById(idVenta);

  const numberConverter = (rowData, key: string) => {
    switch (key) {
      case "precio_unitario":
        return (
          <>{Intl.NumberFormat("es-ES").format(rowData.precio_unitario)}</>
        );
      case "subtotal":
        return <>{Intl.NumberFormat("es-ES").format(rowData.subtotal)}</>;
      case "iva":
        return <>{Intl.NumberFormat("es-ES").format(rowData.iva)}</>;

        break;
    }
  };

  return (
    <>
      <Dialog
        header="Detalle de Vemta"
        visible={openModal}
        style={{ width: "50vw" }}
        onHide={() => {
          if (!openModal) return;
          setOpenModal(false);
        }}
        footer={
          <>
            <Button
              className="bg-bluegray-600"
              label="Cancelar"
              icon="pi pi-times"
              onClick={() => setOpenModal(false)}
              size="small"
              rounded
              severity="danger"
            ></Button>
          </>
        }
      >
        <DataTable
          value={datosDetalles}
          dataKey="id_detalle_venta"
          metaKeySelection={false}
          tableStyle={{ minWidth: "50rem", fontSize: "10px" }}
        >
          <Column field="id_detalle_venta" header="ID Detalle"></Column>
          <Column field="id_venta" header="ID Venta"></Column>
          <Column field="nombre" header="Producto Vendido"></Column>
          <Column field="nombre_apellido" header="Vendido por"></Column>
          <Column field="cantidad" header="Cantidad"></Column>
          <Column
            field="precio_unitario"
            body={(rowdata) => numberConverter(rowdata, "precio_unitario")}
            header="Precio Unitario"
          ></Column>
          <Column
            field="subtotal"
            body={(rowdata) => numberConverter(rowdata, "subtotal")}
            header="SubTotal"
          ></Column>
          <Column
            field="iva"
            body={(rowdata) => numberConverter(rowdata, "iva")}
            header="IVA"
          ></Column>
        </DataTable>
      </Dialog>
    </>
  );
}
