"use client";

import { getAllProveedores } from "@/app/_api/proveedores/getAllProveedores";
import { useQuery } from "@tanstack/react-query";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { useRef, useState } from "react";
import { useCompraStore } from "../store/compraStore";
import { Toast } from "primereact/toast";

export default function ModalProveedorCompra() {
  const openModal = useCompraStore((state) => state.openModalProveedor);
  const setOpenModal = useCompraStore((state) => state.modalProveedor);
  const setProveedor = useCompraStore((state) => state.addProveedor);
  const toast = useRef<Toast>(null);

  const [selectedProveedor, setSelectedProveedor] = useState(null);

  const onRowSelectProv = (event: any) => {
    setProveedor({
      id_proveedor: event.data.id_proveedor,
      descripcion: event.data.descripcion,
      razon_social: event.data.razon_social,
      ruc: event.data.ruc,
      direccion: event.data.direccion,
      estado: event.data.estado
    })
    toast.current?.show({
      severity: "info",
      summary: "Proveedor Seleccionado!",
      detail: `Nombre: ${event.data.descripcion}`,
      life: 3000,
    });
    setOpenModal(false);
  };
  const onRowUnselectProv = (event: any) => {
    toast.current?.show({
      severity: "warn",
      summary: "Proveedor Desmarcado!",
      detail: `Nombre: ${event.data.descripcion}`,
      life: 3000,
    });
  };
  const { data: proveedores = [] } = useQuery({
    queryKey: ["proveedor"],
    queryFn: getAllProveedores,
  });

  console.log("estoy en modal de proveedores", openModal);

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        header="Selecciona el Proveedor"
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
              icon="pi
                      pi-times"
              onClick={() => setOpenModal(false)}
              size="small"
              rounded
              severity="danger"
            ></Button>
          </>
        }
      >
        <DataTable
          value={proveedores}
          selectionMode="single"
          selection={selectedProveedor}
          onSelectionChange={(e) => setSelectedProveedor(e.value)}
          dataKey="id_proveedor"
          onRowSelect={onRowSelectProv}
          onRowUnselect={onRowUnselectProv}
          metaKeySelection={false}
          tableStyle={{ minWidth: "50rem", fontSize: "10px" }}
        >
          <Column field="id_proveedor" header="ID"></Column>
          <Column field="razon_social" header="Razón Social"></Column>
          <Column field="ruc" header="RUC"></Column>
        </DataTable>
      </Dialog>
    </>
  );
}
