"use client";
import React, { useState, useEffect, useRef } from "react";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { Dialog } from "primereact/dialog";

import "primereact/resources/themes/lara-light-indigo/theme.css";
import { Trash2, SquarePen } from "lucide-react";
import { Cliente } from "../../interfaces/cliente.interface";
import { useQuery } from "@tanstack/react-query";
import { getAllClientes } from "@/app/_api/clientes/getAllClientes";

export default function Clientes() {
  const emptyClient: Cliente = {
    id_cliente: 0,
    nombre_apellido: "",
    ruc: "",
    ci: "",
    nro_tel: "",
    direccion: "",
    correo: "",
    id_mascota: 0,
    estado: 1,
  };

  // const [clients, setClients] = useState<Cliente[] | null>(null);
  const [clientDialog, setClientDialog] = useState(false);
  const [deleteClientDialog, setDeleteClientDialog] = useState(false);
  const [deleteClientsDialog, setDeleteClientsDialog] = useState(false);
  const [client, setClient] = useState<Cliente>(emptyClient);
  const [selectedClients, setSelectedClients] = useState<Cliente[] | null>(
    null
  );
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState<string | null>(null);
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<Cliente[]>>(null);

  const {
    data: clients = [],
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["allclientes"],
    queryFn: getAllClientes,
  });

  console.log(clients);
  const openNew = () => {
    setClient(emptyClient);
    setSubmitted(false);
    setClientDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setClientDialog(false);
  };

  const hideDeleteClientDialog = () => {
    setDeleteClientDialog(false);
  };

  const hideDeleteClientsDialog = () => {
    setDeleteClientsDialog(false);
  };

  const saveClient = () => {
    setSubmitted(true);

    if (client.nombre_apellido.trim()) {
      let _clients = [...(clients || [])];
      let _client = { ...client };

      if (client.id_cliente) {
        const index = findIndexById(client.id_cliente);
        _clients[index] = _client;
        toast.current?.show({
          severity: "success",
          summary: "Successful",
          detail: "Cliente actualizado",
          life: 3000,
        });
      } else {
        _client.id_cliente = Date.now();
        _clients.push(_client);
        toast.current?.show({
          severity: "success",
          summary: "Successful",
          detail: "Cliente creado",
          life: 3000,
        });
      }

      setClients(_clients);
      setClientDialog(false);
      setClient(emptyClient);
    }
  };

  const editClient = (client: Cliente) => {
    setClient({ ...client });
    setClientDialog(true);
  };

  const confirmDeleteClient = (client: Cliente) => {
    setClient(client);
    setDeleteClientDialog(true);
  };

  const deleteClient = () => {
    const _clients =
      clients?.filter((val) => val.id_cliente !== client.id_cliente) || [];
    setClients(_clients);
    setDeleteClientDialog(false);
    setClient(emptyClient);
    toast.current?.show({
      severity: "success",
      summary: "Successful",
      detail: "Cliente eliminado",
      life: 3000,
    });
  };

  const findIndexById = (id: number) => {
    return clients?.findIndex((c) => c.id_cliente === id) ?? -1;
  };

  const exportCSV = () => {
    dt.current?.exportCSV();
  };

  const confirmDeleteSelected = () => {
    setDeleteClientsDialog(true);
  };

  const deleteSelectedClients = () => {
    const _clients =
      clients?.filter((val) => !selectedClients?.includes(val)) || [];
    setClients(_clients);
    setDeleteClientsDialog(false);
    setSelectedClients(null);
    toast.current?.show({
      severity: "success",
      summary: "Successful",
      detail: "Clientes eliminados",
      life: 3000,
    });
  };

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0">Gestionar Clientes</h4>
      <IconField iconPosition="left">
        <InputIcon className="pi pi-search" />
        <InputText
          type="search"
          onInput={(e) => setGlobalFilter((e.target as HTMLInputElement).value)}
          placeholder="Buscar..."
        />
      </IconField>
    </div>
  );

  const clientDialogFooter = (
    <>
      <Button
        label="Cancelar"
        icon="pi pi-times"
        outlined
        onClick={hideDialog}
      />
      <Button label="Guardar" icon="pi pi-check" onClick={saveClient} />
    </>
  );

  const deleteClientDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={hideDeleteClientDialog}
      />
      <Button
        label="Sí"
        icon="pi pi-check"
        severity="danger"
        onClick={deleteClient}
      />
    </>
  );

  const deleteClientsDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={hideDeleteClientsDialog}
      />
      <Button
        label="Sí"
        icon="pi pi-check"
        severity="danger"
        onClick={deleteSelectedClients}
      />
    </>
  );

  return (
    <div>
      <Toast ref={toast} />
      <div className="p-3 bg-gray-100 text-center rounded-lg shadow-md">
        <h1 className="text-3xl font-semibold text-gray-800">Clientes</h1>
      </div>
      <br />
      <div className="card">
        <Toolbar
          className="mb-4"
          left={() => (
            <div className="flex flex-wrap gap-2">
              <Button
                label="+ Nuevo Cliente"
                icon="pi pi-plus"
                severity="info"
                onClick={openNew}
              />
              
            </div>
          )}
          right={() => (
            <Button
              label="Excel"
              icon="pi pi-upload"
              severity="success"
              onClick={exportCSV}
            />
          )}
        />

        <DataTable
          ref={dt}
          value={clients || []}
          selection={selectedClients}
          dataKey="id_cliente"
          paginator
          rows={5}
          globalFilter={globalFilter}
          header={header}
        >
          {/* <Column selectionMode="multiple" exportable={false} /> */}
          <Column field="nombre_apellido" header="Nombre y Apellido" sortable />
          <Column field="ruc" header="RUC" />
          <Column field="ci" header="CI" />
          <Column field="nro_tel" header="Teléfono" />
          <Column field="correo" header="Correo" />
          <Column field="direccion" header="Dirección" />
          <Column field="estado" header="Estado" hidden />
          <Column
            header="Acción"
            body={(rowData: Cliente) => (
              <>
                <Button
                  icon={<SquarePen />}
                  rounded
                  outlined
                  className="mr-3"
                  onClick={() => editClient(rowData)}
                />

                <Button
                  icon={<Trash2 />}
                  rounded
                  outlined
                  severity="danger"
                  onClick={() => confirmDeleteClient(rowData)}
                />
              </>
            )}
            exportable={false}
          />
        </DataTable>
      </div>

      <Dialog
        visible={clientDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Datos del Cliente"
        modal
        className="p-fluid"
        footer={clientDialogFooter}
        onHide={hideDialog}
      >
        <div className="field">
          <label htmlFor="nombre_apellido" className="font-bold">
            Nombre y Apellido
          </label>
          <InputText
            id="nombre_apellido"
            value={client.nombre_apellido}
            onChange={(e) =>
              setClient({ ...client, nombre_apellido: e.target.value })
            }
            required
            autoFocus
            className={classNames({
              "p-invalid": submitted && !client.nombre_apellido,
            })}
          />
          {submitted && !client.nombre_apellido && (
            <small className="p-error">El nombre es obligatorio.</small>
          )}
        </div>
        <div className="field">
          <label htmlFor="ruc" className="font-bold">
            RUC
          </label>
          <InputText
            id="ruc"
            value={client.ruc}
            onChange={(e) => setClient({ ...client, ruc: e.target.value })}
          />
        </div>
        <div className="field">
          <label htmlFor="ci" className="font-bold">
            CI
          </label>
          <InputText
            id="ci"
            value={client.ci}
            onChange={(e) => setClient({ ...client, ci: e.target.value })}
          />
        </div>
        <div className="field">
          <label htmlFor="nro_tel" className="font-bold">
            Teléfono
          </label>
          <InputText
            id="nro_tel"
            value={client.nro_tel}
            onChange={(e) => setClient({ ...client, nro_tel: e.target.value })}
          />
        </div>
        <div className="field">
          <label htmlFor="direccion" className="font-bold">
            Dirección
          </label>
          <InputText
            id="direccion"
            value={client.direccion}
            onChange={(e) =>
              setClient({ ...client, direccion: e.target.value })
            }
          />
        </div>
        <div className="field">
          <label htmlFor="correo" className="font-bold">
            Correo
          </label>
          <InputText
            id="correo"
            value={client.correo}
            onChange={(e) => setClient({ ...client, correo: e.target.value })}
          />
        </div>
      </Dialog>

      <Dialog
        visible={deleteClientDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirmar"
        modal
        footer={deleteClientDialogFooter}
        onHide={hideDeleteClientDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {client && (
            <span>
              ¿Estás seguro que deseas eliminar a{" "}
              <b>{client.nombre_apellido}</b>?
            </span>
          )}
        </div>
      </Dialog>

      <Dialog
        visible={deleteClientsDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirmar"
        modal
        footer={deleteClientsDialogFooter}
        onHide={hideDeleteClientsDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {client && (
            <span>
              ¿Estás seguro que deseas eliminar los clientes seleccionados?
            </span>
          )}
        </div>
      </Dialog>
    </div>
  );
}
