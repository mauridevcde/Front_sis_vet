"use client";
import React, { useState, useRef } from "react";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllClientes } from "@/app/_api/clientes/getAllClientes";
import { SyncLoader } from "react-spinners";
import { postCliente } from "@/app/_api/clientes/postClientes";
import { SelectButton } from "primereact/selectbutton";
import { Dropdown } from "primereact/dropdown";

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

  const queryClient = useQueryClient();
  //aca se realiza el post del cliente.
  const mutation = useMutation({
    mutationFn: postCliente,
    onSuccess: async () => {
      toast.current?.show({
        severity: "success",
        summary: "Successful",
        detail: "Cliente creado",
        life: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
      setClientDialog(false);
      setClient(emptyClient);
    },
  });
  const saveClient = () => {
    setSubmitted(true);
    console.log("btn guardar", client);
    mutation.mutate(client);
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
    <>
      {isPending ? (
        <SyncLoader />
      ) : (
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
              <Column
                field="nombre_apellido"
                header="Nombre y Apellido"
                sortable
              />
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

              <label htmlFor="id_mascota" className="font-bold">
                Mascotas
              </label>
              <Dropdown
                id="id_mascota"
                value={client.id_mascota}
                options={[
                  { label: "Mascota 1", value: 1 },
                  { label: "Mascota 2", value: 2 },
                  // Agrega aquí las opciones reales de mascotas
                ]}
                onChange={(e) =>
                  setClient({ ...client, id_mascota: e.value })
                }
                required
                className={classNames({
                  "p-invalid": submitted && !client.id_mascota,
                })}
              />
              {submitted && !client.id_mascota && (
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
                required
                className={classNames({
                  "p-invalid": submitted && !client.ruc,
                })}
              />
              {submitted && !client.ruc && (
                <small className="p-error">El ruc es obligatorio.</small>
              )}
            </div>
            <div className="field">
              <label htmlFor="ci" className="font-bold">
                CI
              </label>
              <InputText
                id="ci"
                required
                value={client.ci}
                onChange={(e) => setClient({ ...client, ci: e.target.value })}
                className={classNames({
                  "p-invalid": submitted && !client.ci,
                })}
              />
              {submitted && !client.ci && (
                <small className="p-error">El ci es obligatorio.</small>
              )}
            </div>
            <div className="field">
              <label htmlFor="nro_tel" className="font-bold">
                Teléfono
              </label>
              <InputText
                id="nro_tel"
                value={client.nro_tel}
                required
                onChange={(e) =>
                  setClient({ ...client, nro_tel: e.target.value })
                }
                className={classNames({
                  "p-invalid": submitted && !client.nro_tel,
                })}
              />
              {submitted && !client.nro_tel && (
                <small className="p-error">
                  El Nro de telelefono es obligatorio.
                </small>
              )}
            </div>
            <div className="field">
              <label htmlFor="direccion" className="font-bold">
                Dirección
              </label>
              <InputText
                id="direccion"
                value={client.direccion}
                required
                onChange={(e) =>
                  setClient({ ...client, direccion: e.target.value })
                }
                className={classNames({
                  "p-invalid": submitted && !client.direccion,
                })}
              />
              {submitted && !client.direccion && (
                <small className="p-error">La direccion es obligatorio.</small>
              )}
            </div>
            <div className="field">
              <label htmlFor="correo" className="font-bold">
                Correo
              </label>
              <InputText
                id="correo"
                value={client.correo}
                required
                onChange={(e) =>
                  setClient({ ...client, correo: e.target.value })
                }
                className={classNames({
                  "p-invalid": submitted && !client.ruc,
                })}
              />
              {submitted && !client.correo && (
                <small className="p-error">El correo es obligatorio.</small>
              )}
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
      )}
    </>
  );
}
