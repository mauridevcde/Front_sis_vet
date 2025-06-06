"use client";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import React, { useState, useRef } from "react";
import { classNames } from "primereact/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllClientes } from "@/app/_api/clientes/getAllClientes";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { Dialog } from "primereact/dialog";
import { Trash2, SquarePen } from "lucide-react";
import { Cliente } from "../../interfaces/cliente.interface";
import { SyncLoader } from "react-spinners";
import { postCliente } from "@/app/_api/clientes/postClientes";

import { putCliente } from "@/app/_api/clientes/putClientes";
import { deleteClientes } from "@/app/_api/clientes/deleteClientes";

export default function Clientes() {
  const emptyClient: Cliente = {
    id_cliente: 0,
    nombre_apellido: "",
    ruc: "",
    ci: "",
    nro_tel: "",
    direccion: "",
    correo: "",
    estado: 1,
  };

  // const [clients, setClients] = useState<Cliente[] | null>(null);
  const [clientDialog, setClientDialog] = useState(false);

  const [deleteClientDialog, setDeleteClientDialog] = useState(false);

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

  const queryClient = useQueryClient();
  //aca se realiza el post del cliente.
  const mutationNewClient = useMutation({
    mutationFn: postCliente,
    onSuccess: async () => {
      toast.current?.show({
        severity: "success",
        summary: "Successful",
        detail: "Cliente creado",
        life: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["allclientes"] });
      setClientDialog(false);
      setClient(emptyClient);
    },
    onError: (error) => {
      console.error("Error al crear cliente:", error);
      const zodErrors = error?.response?.data?.errors;

      const message = Array.isArray(zodErrors)
        ? zodErrors.map((e) => e.message).join("\nn")
        : error?.response?.data?.message || "Error desconocido.";

      toast.current?.show({
        severity: "error",
        summary: "Errores de validación",
        detail: message,
        life: 6000,
      });
    },
  });

  const updateClientMutation = useMutation({
    mutationFn: putCliente,
    onSuccess: () => {
      toast.current?.show({
        severity: "success",
        summary: "Cliente actualizado",
        detail: "El cliente fue actualizado correctamente.",
        life: 3000,
      });

      queryClient.invalidateQueries({ queryKey: ["allclientes"] });
      setClientDialog(false);
    },
    onError: (error: any) => {
      console.error("Error al actualizar cliente:", error);
      const zodErrors = error?.response?.data?.errors;

      const message = Array.isArray(zodErrors)
        ? zodErrors.map((e: any) => e.message).join("\n")
        : error?.response?.data?.message || "Error desconocido.";

      toast.current?.show({
        severity: "error",
        summary: "Errores de validación",
        detail: message,
        life: 6000,
      });
    },
  });

  const deleteClientMutation = useMutation({
    mutationFn: deleteClientes,
    onSuccess: () => {
      toast.current?.show({
        severity: "success",
        summary: "Cliente Eliminado",
        detail: "El cliente fue eliminado correctamente.",
        life: 3000,
      });

      queryClient.invalidateQueries({ queryKey: ["allclientes"] });
      setClientDialog(false);
    },
    onError: (error) => {
      console.error("Error al actualizar cliente:", error);

      toast.current?.show({
        severity: "error",
        summary: "Errores de validación",
        detail: error.message,
        life: 6000,
      });
    },
  });

  //aca verificamos si existe id entonces actualiza  sino crea.
  const saveClient = () => {
    console.log("ver que pasa por detras: ", client);
    setSubmitted(true);
    if (client.nombre_apellido.trim()) {
      if (client.id_cliente !== 0) {
        console.log("actualizar");

        updateClientMutation.mutate(client); // ← actualiza cliente
      } else {
        console.log("crear");
        mutationNewClient.mutate(client); // ← crea cliente
      }
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
    setDeleteClientDialog(false);
    console.log("cliente", client.id_cliente);
    deleteClientMutation.mutate(client);
  };

  const exportCSV = () => {
    dt.current?.exportCSV();
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
          style={{
            fontSize: "12px",
            height: "40px",
            width: "200px",
            padding: "0px 6px",
          }}
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
      <Button
        label="Guardar"
        icon="pi pi-check"
        disabled={isError}
        onClick={saveClient}
      />
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

  return (
    <>
      {isPending ? (
        <SyncLoader />
      ) : (
        <div>
          <Toast ref={toast} />
          {/* motal de mascotas */}

          <div className="p-2 mb-2 bg-gray-100 text-center rounded-lg shadow-md">
            <h1 className="m-0 text-md font-semibold text-gray-800">
              Clientes
            </h1>
          </div>

          <div className="card">
            <Toolbar
              className="mb-2"
              left={() => (
                <div className="flex flex-wrap gap-1">
                  <Button
                    label="+ Nuevo Cliente"
                    icon="pi pi-plus"
                    severity="info"
                    style={{ fontSize: "14px" }}
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
              sortField="nombre_apellido"
              sortOrder={-1}
              value={clients || []}
              selection={selectedClients}
              dataKey="id_cliente"
              color="black"
              paginator
              rows={5}
              globalFilter={globalFilter}
              header={header}
              style={{ fontSize: "14px" }}
            >
              <Column
                field="nombre_apellido"
                header="Nombre y Apellido"
                style={{ color: "#374151" }}
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
                      style={{
                        fontSize: "10px",
                        height: "40px",
                        width: "40px",
                        padding: "2px",
                        marginRight: "4px",
                      }}
                    />

                    <Button
                      icon={<Trash2 />}
                      rounded
                      outlined
                      severity="danger"
                      onClick={() => confirmDeleteClient(rowData)}
                      style={{
                        fontSize: "10px",
                        height: "40px",
                        width: "40px",
                        padding: "2px",
                        marginRight: "4px",
                      }}
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
                type="email"
                keyfilter="email"
                value={client.correo}
                required
                onChange={(e) =>
                  setClient({ ...client, correo: e.target.value })
                }
                className={classNames({
                  "p-invalid": submitted && !client.correo,
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
        </div>
      )}
    </>
  );
}
