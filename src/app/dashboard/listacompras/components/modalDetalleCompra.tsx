"use client";

import { getAllProveedores } from "@/app/_api/proveedores/getAllProveedores";
import { useQuery } from "@tanstack/react-query";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { getDetalleByIdCompra } from "@/app/_api/compras/getDetalleByIdCompra";
import { useDetalleCompraStore } from "../store/detalleCompraStore";

export default function ModalDetalleCompra() {
  const idCompra = useDetalleCompraStore((state) => state.idCompra);
  const openModal = useDetalleCompraStore((state) => state.openModalDetalles);
  const setOpenModal = useDetalleCompraStore(
    (state) => state.setOpenModalDetalles
  );

  const useDetalleComprasById = (id: number) => {
    return useQuery({
      queryKey: ["getDetalleByIdCompra", id],
      queryFn: () => getDetalleByIdCompra(id),
      enabled: !!id,
    });
  };

  const { data: datosDetalles, isPending: isPendingDetalles } =
    useDetalleComprasById(idCompra);

  const numberConverter = (rowData, key: string) => {
    switch (key) {
      case "costo":
        return <>{Intl.NumberFormat("es-ES").format(rowData.costo)}</>;
      case "subtotal":
        return <>{Intl.NumberFormat("es-ES").format(rowData.subtotal)}</>;
      case "iva":
        return <>{Intl.NumberFormat("es-ES").format(rowData.iva)}</>;
      case "costomedio":
        return <>{Intl.NumberFormat("es-ES").format(rowData.CostoMedio)}</>;
        break;
    }
  };

  return (
    <>
      <Dialog
        header="Detalle de Compra"
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
          dataKey="id_detalle_compra"
          metaKeySelection={false}
          tableStyle={{ minWidth: "50rem", fontSize: "10px" }}
        >
          <Column field="id_detalle_compra" header="ID Detalle"></Column>
          <Column field="id_compra" header="ID Compra"></Column>
          <Column field="nombre" header="Producto Comprado"></Column>
          <Column field="nombre_apellido" header="Comprado por"></Column>
          <Column field="cantidad" header="Cantidad"></Column>
          <Column
            field="costo"
            body={(rowdata) => numberConverter(rowdata, "costo")}
            header="Costo"
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
          <Column
            field="CostoMedio"
            body={(rowdata) => numberConverter(rowdata, "costomedio")}
            header="Costo Medio"
          ></Column>
        </DataTable>
      </Dialog>
    </>
  );
}
