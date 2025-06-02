// Este es un archivo adaptado para gestionar "proveedores" en lugar de "clientes".
// Se asume que ya tienes implementadas las funciones:
// getAllProveedores, postProveedor, putProveedor, deleteProveedores

"use client";
import React, { useState, useRef } from "react";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import { classNames } from "primereact/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllProveedores } from "@/app/_api/proveedores/getAllProveedores";
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
import { Proveedor } from "../../interfaces/proveedores.interface";
import { SyncLoader } from "react-spinners";
import { postProveedor } from "@/app/_api/proveedores/postProveedores";
import { putProveedor } from "@/app/_api/proveedores/putProveedores";
import { deleteProveedores } from "@/app/_api/proveedores/deleteProveedores";

export default function Proveedores() {
  const emptyProveedor: Proveedor = {
    id_proveedor: 0,
    descripcion: "",
    razon_social: "",
    ruc: "",
    direccion: "",
    estado: 1,
  };

  const [proveedorDialog, setProveedorDialog] = useState(false);
  const [deleteProveedorDialog, setDeleteProveedorDialog] = useState(false);
  const [proveedor, setProveedor] = useState<Proveedor>(emptyProveedor);
  const [selectedProveedores, setSelectedProveedores] = useState<Proveedor[] | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState<string | null>(null);
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<Proveedor[]>>(null);

  const { data: proveedores = [], isPending, isError } = useQuery({
    queryKey: ["allproveedores"],
    queryFn: getAllProveedores,
  });

  const queryClient = useQueryClient();

  const mutationNewProveedor = useMutation({
    mutationFn: postProveedor,
    onSuccess: () => {
      toast.current?.show({
        severity: "success",
        summary: "Proveedor creado",
        detail: "Proveedor creado correctamente.",
        life: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["allproveedores"] });
      setProveedorDialog(false);
      setProveedor(emptyProveedor);
    },
    onError: (error: any) => {
      const zodErrors = error?.response?.data?.errors;
      const message = Array.isArray(zodErrors)
        ? zodErrors.map((e) => e.message).join("\n")
        : error?.response?.data?.message || "Error desconocido.";

      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: message,
        life: 6000,
      });
    },
  });

  const updateProveedorMutation = useMutation({
    mutationFn: putProveedor,
    onSuccess: () => {
      toast.current?.show({
        severity: "success",
        summary: "Proveedor actualizado",
        detail: "Proveedor actualizado correctamente.",
        life: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["allproveedores"] });
      setProveedorDialog(false);
    },
    onError: (error: any) => {
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

  const deleteProveedorMutation = useMutation({
    mutationFn: deleteProveedores,
    onSuccess: () => {
      toast.current?.show({
        severity: "success",
        summary: "Proveedor eliminado",
        detail: "Proveedor eliminado correctamente.",
        life: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["allproveedores"] });
    },
    onError: (error: any) => {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: error.message,
        life: 6000,
      });
    },
  });

  const openNew = () => {
    setProveedor(emptyProveedor);
    setSubmitted(false);
    setProveedorDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setProveedorDialog(false);
  };

  const hideDeleteProveedorDialog = () => {
    setDeleteProveedorDialog(false);
  };

  const saveProveedor = () => {
    setSubmitted(true);
    if (proveedor.descripcion.trim()) {
      if (proveedor.id_proveedor !== 0) {
        updateProveedorMutation.mutate(proveedor);
      } else {
        mutationNewProveedor.mutate(proveedor);
      }
    }
  };

  const editProveedor = (rowData: Proveedor) => {
    setProveedor({ ...rowData });
    setProveedorDialog(true);
  };

  const confirmDeleteProveedor = (rowData: Proveedor) => {
    setProveedor(rowData);
    setDeleteProveedorDialog(true);
  };

  const deleteProveedor = () => {
    deleteProveedorMutation.mutate(proveedor);
    setDeleteProveedorDialog(false);
  };

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0">Gestionar Proveedores</h4>
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

  const proveedorDialogFooter = (
    <>
      <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDialog} />
      <Button label="Guardar" icon="pi pi-check" onClick={saveProveedor} />
    </>
  );

  const deleteProveedorDialogFooter = (
    <>
      <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteProveedorDialog} />
      <Button label="Sí" icon="pi pi-check" severity="danger" onClick={deleteProveedor} />
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
            <h1 className="text-3xl font-semibold text-gray-800">Proveedores</h1>
          </div>
          <br />
          <div className="card">
            <Toolbar
              className="mb-4"
              left={() => (
                <div className="flex flex-wrap gap-2">
                  <Button label="+ Nuevo Proveedor" icon="pi pi-plus" severity="info" onClick={openNew} />
                </div>
              )}
            />

            <DataTable
              ref={dt}
              value={proveedores || []}
              selection={selectedProveedores}
              dataKey="id_proveedor"
              paginator
              rows={5}
              globalFilter={globalFilter}
              header={header}
            >
              <Column field="descripcion" header="Descripción" sortable />
              <Column field="razon_social" header="Razón Social" />
              <Column field="ruc" header="RUC" />
              <Column field="direccion" header="Dirección" />
              <Column
                header="Acción"
                body={(rowData: Proveedor) => (
                  <>
                    <Button icon={<SquarePen />} rounded outlined className="mr-3" title="editar" onClick={() => editProveedor(rowData)} />
                    <Button icon={<Trash2 />} rounded outlined severity="danger" title="eliminar" onClick={() => confirmDeleteProveedor(rowData)} />
                  </>
                )}
                exportable={false}
              />
            </DataTable>
          </div>

          <Dialog
            visible={proveedorDialog}
            style={{ width: "32rem" }}
            breakpoints={{ "960px": "75vw", "641px": "90vw" }}
            header="Datos del Proveedor"
            modal
            className="p-fluid"
            footer={proveedorDialogFooter}
            onHide={hideDialog}
          >
            <div className="field">
              <label htmlFor="descripcion" className="font-bold">
                Descripción
              </label>
              <InputText
                id="descripcion"
                value={proveedor.descripcion}
                onChange={(e) => setProveedor({ ...proveedor, descripcion: e.target.value })}
                required
                className={classNames({ "p-invalid": submitted && !proveedor.descripcion })}
              />
              {submitted && !proveedor.descripcion && <small className="p-error">La descripción es obligatoria.</small>}
            </div>
            <div className="field">
              <label htmlFor="razon_social" className="font-bold">
                Razón Social
              </label>
              <InputText
                id="razon_social"
                value={proveedor.razon_social}
                onChange={(e) => setProveedor({ ...proveedor, razon_social: e.target.value })}
                required
                className={classNames({ "p-invalid": submitted && !proveedor.razon_social })}
              />
              {submitted && !proveedor.razon_social && <small className="p-error">La razón social es obligatoria.</small>}
            </div>
            <div className="field">
              <label htmlFor="ruc" className="font-bold">
                RUC
              </label>
              <InputText
                id="ruc"
                value={proveedor.ruc}
                onChange={(e) => setProveedor({ ...proveedor, ruc: e.target.value })}
                required
                className={classNames({ "p-invalid": submitted && !proveedor.ruc })}
              />
              {submitted && !proveedor.ruc && <small className="p-error">El RUC es obligatorio.</small>}
            </div>
            <div className="field">
              <label htmlFor="direccion" className="font-bold">
                Dirección
              </label>
              <InputText
                id="direccion"
                value={proveedor.direccion}
                onChange={(e) => setProveedor({ ...proveedor, direccion: e.target.value })}
                required
                className={classNames({ "p-invalid": submitted && !proveedor.direccion })}
              />
              {submitted && !proveedor.direccion && <small className="p-error">La dirección es obligatoria.</small>}
            </div>
          </Dialog>

          <Dialog
            visible={deleteProveedorDialog}
            style={{ width: "32rem" }}
            breakpoints={{ "960px": "75vw", "641px": "90vw" }}
            header="Confirmar"
            modal
            footer={deleteProveedorDialogFooter}
            onHide={hideDeleteProveedorDialog}
          >
            <div className="confirmation-content">
              <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
              {proveedor && <span>¿Estás seguro que deseas eliminar a <b>{proveedor.descripcion}</b>?</span>}
            </div>
          </Dialog>
        </div>
      )}
    </>
  );
}
