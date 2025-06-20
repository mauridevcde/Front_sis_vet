"use client";

import { getAllClientes } from "@/app/_api/clientes/getAllClientes";
import { useQuery } from "@tanstack/react-query";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { useRef, useState } from "react";
import { useVentaStore } from "../store/storeVenta";

export default function ModalSelectedClient() {
  const openModal = useVentaStore((state) => state.openModalClientes);
  const setOpenModal = useVentaStore((state) => state.modalClientes);
  const setCliente = useVentaStore((state) => state.addCliente);
  const toast = useRef<Toast>(null);

  const [selectedCliente, setSelectedCliente] = useState(null);

  const onRowSelectProv = (event: any) => {
    setCliente({
      id_cliente: event.data.id_cliente,
      nombre_apellido: event.data.nombre_apellido,
      ruc: event.data.ruc,
      ci: event.data.ci,
      nro_tel: event.data.nro_tel,
      direccion: event.data.direccion,
      correo: event.data.correo,
      estado: event.data.estado,
    });
    toast.current?.show({
      severity: "info",
      summary: "Cliente Seleccionado!",
      detail: `Descripcion: ${event.data.nombre_apellido}`,
      life: 3000,
    });
    setOpenModal(false);
  };

  const { data: clientes = [] } = useQuery({
    queryKey: ["clienteModal"],
    queryFn: getAllClientes,
  });

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        header="Selecciona el Cliente"
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
          value={clientes}
          selectionMode="single"
          selection={selectedCliente}
          onSelectionChange={(e) => setSelectedCliente(e.value)}
          dataKey="id_cliente"
          onRowSelect={onRowSelectProv}
          metaKeySelection={false}
          tableStyle={{ minWidth: "50rem", fontSize: "10px" }}
        >
          <Column field="id_cliente" header="ID"></Column>
          <Column field="nombre_apellido" header="Nombre y Apellido"></Column>
          <Column field="ruc" header="RUC"></Column>
        </DataTable>
      </Dialog>
    </>
  );
}
