"use client";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import React, { useState, useRef } from "react";
import { classNames } from "primereact/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllVeterinarios } from "@/app/_api/veterinarios/getAllVeterinarios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { InputText } from "primereact/inputtext";
import { InputIcon } from "primereact/inputicon";
import { IconField } from "primereact/iconfield";
import { Dialog } from "primereact/dialog";
import { Trash2, SquarePen } from "lucide-react";
import { Veterinario } from "../../interfaces/veterinarios.interface";
import { SyncLoader } from "react-spinners";
import { postVeterinario } from "@/app/_api/veterinarios/postVeterinarios";
import { putVeterinario } from "@/app/_api/veterinarios/putVeterinarios";
import { deleteVeterinarios } from "@/app/_api/veterinarios/deleteVeterinarios";

export default function Veterinarios() {
  const emptyVeterinario: Veterinario = {
    id_veterinario: 0,
    nombre_apellido: "",
    matricula: "",
    estado: true,
  };

  const [veterinarioDialog, setVeterinarioDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [veterinario, setVeterinario] = useState<Veterinario>(emptyVeterinario);

  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState<string | null>(null);
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<Veterinario[]>>(null);

  const { data: vets = [], isPending } = useQuery({
    queryKey: ["allVeterinarios"],
    queryFn: getAllVeterinarios,
  });

  const queryClient = useQueryClient();

  const mutationNew = useMutation({
    mutationFn: postVeterinario,
    onSuccess: () => {
      toast.current?.show({
        severity: "success",
        summary: "Creado",
        detail: "Veterinario creado",
        life: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["allVeterinarios"] });
      setVeterinarioDialog(false);
      setVeterinario(emptyVeterinario);
    },
    onError: (err: unknown) => {
      console.error(err);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: typeof err === "object" && err !== null && "message" in err
          ? (err as { message?: string }).message
          : "Error desconocido",
        life: 6000,
      });
    },
  });

  const mutationUpdate = useMutation({
    mutationFn: putVeterinario,
    onSuccess: () => {
      toast.current?.show({
        severity: "success",
        summary: "Actualizado",
        detail: "Veterinario actualizado",
        life: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["allVeterinarios"] });
      setVeterinarioDialog(false);
    },
    onError: (err: unknown) => {
      console.error(err);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: typeof err === "object" && err !== null && "message" in err
          ? (err as { message?: string }).message
          : "Error desconocido",
        life: 6000,
      });
    },
  });

  const mutationDelete = useMutation({
    mutationFn: deleteVeterinarios,
    onSuccess: () => {
      toast.current?.show({
        severity: "success",
        summary: "Eliminado",
        detail: "Veterinario eliminado",
        life: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["allVeterinarios"] });
      setDeleteDialog(false);
    },
    onError: (err: unknown) => {
      console.error(err);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: typeof err === "object" && err !== null && "message" in err
          ? (err as { message?: string }).message
          : "Error desconocido",
        life: 6000,
      });
    },
  });

  const openNew = () => {
    setVeterinario(emptyVeterinario);
    setSubmitted(false);
    setVeterinarioDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setVeterinarioDialog(false);
  };

  const hideDeleteDialog = () => setDeleteDialog(false);

  const saveVeterinario = () => {
    setSubmitted(true);
    if ((veterinario.nombre_apellido ?? "").trim()) {
      if (veterinario.id_veterinario !== 0) {
        mutationUpdate.mutate(veterinario);
      } else {
        mutationNew.mutate(veterinario);
      }
    }
  };

  const editVeterinario = (vet: Veterinario) => {
    setVeterinario({ ...vet });
    setVeterinarioDialog(true);
  };
  const confirmDelete = (vet: Veterinario) => {
    setVeterinario(vet);
    setDeleteDialog(true);
  };
  const deleteVet = () => mutationDelete.mutate(veterinario);



  const header = (
    <div className="flex flex-wrap align-items-center justify-content-between">
      <h4>Gestionar Veterinarios</h4>
      <IconField iconPosition="left">
        <InputIcon className="pi pi-search" />
        <InputText
          type="search"
          onInput={(e) => setGlobalFilter((e.target as HTMLInputElement).value)}
          placeholder="Buscar..."
          style={{ width: "200px", height: "40px" }}
        />
      </IconField>
    </div>
  );

  const dialogFooter = (
    <>
      <Button
        label="Cancelar"
        icon="pi pi-times"
        outlined
        onClick={hideDialog}
      />
      <Button label="Guardar" icon="pi pi-check" onClick={saveVeterinario} />
    </>
  );

  const deleteFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        onClick={hideDeleteDialog}
        outlined
      />
      <Button
        label="Sí"
        icon="pi pi-check"
        severity="danger"
        onClick={deleteVet}
      />
    </>
  );

  return (
    <>
      <div>
        <Toast ref={toast} />
        <div className="p-2 mb-2 bg-gray-100 text-center rounded-lg shadow-md">
          <h1 className="m-0 font-semibold">Veterinarios</h1>
        </div>
        <div className="card">
          <Toolbar
            className="mb-2"
            left={() => (
              <Button
                label="+ Nuevo Veterinario"
                icon="pi pi-plus"
                severity="info"
                onClick={openNew}
              />
            )}
          
          />
          {isPending ? (
            <SyncLoader />
          ) : (
            <DataTable
              ref={dt}
              value={vets}
              dataKey="id_veterinario"
              paginator
              rows={5}
              globalFilter={globalFilter}
              header={header}
              style={{ fontSize: "14px" }}
            >
              <Column
                field="nombre_apellido"
                header="Nombre y Apellido"
                sortable
              />
              <Column field="matricula" header="Matrícula" sortable />
              <Column field="estado" header="Estado" hidden />
              <Column
                header="Acción"
                body={(rowData: Veterinario) => (
                  <>
                    <Button
                      icon={<SquarePen />}
                      rounded
                      outlined
                      onClick={() => editVeterinario(rowData)}
                      style={{ marginRight: "4px" }}
                    />
                    <Button
                      icon={<Trash2 />}
                      rounded
                      outlined
                      severity="danger"
                      onClick={() => confirmDelete(rowData)}
                    />
                  </>
                )}
                exportable={false}
              />
            </DataTable>
          )}
        </div>

        <Dialog
          visible={veterinarioDialog}
          style={{ width: "32rem" }}
          header="Datos del Veterinario"
          modal
          className="p-fluid"
          footer={dialogFooter}
          onHide={hideDialog}
        >
          <div className="field">
            <label htmlFor="nombre_apellido" className="font-bold">
              Nombre y Apellido
            </label>
            <InputText
              id="nombre_apellido"
              value={veterinario.nombre_apellido}
              onChange={(e) =>
                setVeterinario({
                  ...veterinario,
                  nombre_apellido: e.target.value,
                })
              }
              required
              autoFocus
              className={classNames({
                "p-invalid": submitted && !veterinario.nombre_apellido,
              })}
            />
            {submitted && !veterinario.nombre_apellido && (
              <small className="p-error">El nombre es obligatorio.</small>
            )}
          </div>
          <div className="field">
            <label htmlFor="matricula" className="font-bold">
              Matrícula
            </label>
            <InputText
              id="matricula"
              value={veterinario.matricula}
              onChange={(e) =>
                setVeterinario({ ...veterinario, matricula: e.target.value })
              }
              required
              className={classNames({
                "p-invalid": submitted && !veterinario.matricula,
              })}
            />
            {submitted && !veterinario.matricula && (
              <small className="p-error">La matrícula es obligatoria.</small>
            )}
          </div>
        </Dialog>

        <Dialog
          visible={deleteDialog}
          style={{ width: "32rem" }}
          header="Confirmar"
          modal
          footer={deleteFooter}
          onHide={hideDeleteDialog}
        >
          <div className="confirmation-content">
            <i
              className="pi pi-exclamation-triangle mr-3"
              style={{ fontSize: "2rem" }}
            />
            {veterinario && (
              <span>
                ¿Estás seguro que deseas eliminar a{" "}
                <b>{veterinario.nombre_apellido}</b>?
              </span>
            )}
          </div>
        </Dialog>
      </div>
    </>
  );
}
