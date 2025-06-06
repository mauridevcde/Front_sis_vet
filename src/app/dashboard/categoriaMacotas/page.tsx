"use client";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import React, { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { SyncLoader } from "react-spinners";
import { classNames } from "primereact/utils";

import { CategoriaMascota } from "../../interfaces/categMascotas";
import { getAllCategorias } from "@/app/_api/categMascotas/getAllCatMascotas";
import { postCategoria } from "@/app/_api/categMascotas/postCatMascotas";
import { putCategoria } from "@/app/_api/categMascotas/putCatMascotas";
import { deleteCategoria } from "@/app/_api/categMascotas/deleteCatMascotas";

export default function CategoriaMascotaPage() {
  const emptyCategoria: CategoriaMascota = {
    id_categoria_mascota: 0,
    descripcion: "",
    estado: true,
  };

  const [categoriaDialog, setCategoriaDialog] = useState(false);
  const [deleteCategoriaDialog, setDeleteCategoriaDialog] = useState(false);
  const [categoria, setCategoria] = useState<CategoriaMascota>(emptyCategoria);
  const [selectedCategorias, setSelectedCategorias] = useState<
    CategoriaMascota[] | null
  >(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState<string | null>(null);
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<CategoriaMascota[]>>(null);
  const queryClient = useQueryClient();

  const {
    data: categorias = [],
    isPending,
    isError,
  } = useQuery({
    queryKey: ["allcategorias"],
    queryFn: getAllCategorias,
  });

  const mutationNewCategoria = useMutation({
    mutationFn: postCategoria,
    onSuccess: () => {
      toast.current?.show({
        severity: "success",
        summary: "Creado",
        detail: "Categoría creada",
        life: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["allcategorias"] });
      setCategoriaDialog(false);
      setCategoria(emptyCategoria);
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

  const updateCategoriaMutation = useMutation({
    mutationFn: putCategoria,
    onSuccess: () => {
      toast.current?.show({
        severity: "success",
        summary: "Actualizado",
        detail: "Categoría actualizada",
        life: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["allcategorias"] });
      setCategoriaDialog(false);
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

  const deleteCategoriaMutation = useMutation({
    mutationFn: deleteCategoria,
    onSuccess: () => {
      toast.current?.show({
        severity: "success",
        summary: "Eliminado",
        detail: "Categoría eliminada",
        life: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["allcategorias"] });
      setDeleteCategoriaDialog(false);
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

  const saveCategoria = () => {
    setSubmitted(true);
    if (categoria.descripcion?.trim()) {
      if (categoria.id_categoria_mascota !== 0) {
        updateCategoriaMutation.mutate(categoria);
      } else {
        mutationNewCategoria.mutate(categoria);
      }
    }
  };

  const openNew = () => {
    setCategoria(emptyCategoria);
    setSubmitted(false);
    setCategoriaDialog(true);
  };

  const editCategoria = (cat: CategoriaMascota) => {
    setCategoria({ ...cat });
    setCategoriaDialog(true);
  };

  const confirmDeleteCategoria = (cat: CategoriaMascota) => {
    setCategoria(cat);
    setDeleteCategoriaDialog(true);
  };

  const deleteCategoriaFn = () => {
    deleteCategoriaMutation.mutate(categoria);
  };

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h1 className="m-0 text-md">Gestionar Categorías de Mascotas</h1>
      <IconField iconPosition="left">
        <InputIcon className="pi pi-search" />
        <InputText
          type="search"
          onInput={(e) => setGlobalFilter((e.target as HTMLInputElement).value)}
          placeholder="Buscar..."
          className="p-inputtext-sm text-sm"
        />
      </IconField>
    </div>
  );

  const categoriaDialogFooter = (
    <>
      <Button
        label="Cancelar"
        icon="pi pi-times"
        className="p-button-sm text-sm"
        outlined
        onClick={() => setCategoriaDialog(false)}
      />
      <Button
        label="Guardar"
        icon="pi pi-check"
        className="p-button-sm text-sm"
        onClick={saveCategoria}
      />
    </>
  );

  const deleteCategoriaDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-sm text-sm"
        outlined
        onClick={() => setDeleteCategoriaDialog(false)}
      />
      <Button
        label="Sí"
        icon="pi pi-check"
        className="p-button-sm text-sm"
        severity="danger"
        onClick={deleteCategoriaFn}
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
          <div className="p-1 mb-2 bg-gray-100 text-center rounded-lg shadow-md">
            <h1 className="text-1xl font-semibold text-gray-800">
              Categorías de Mascotas
            </h1>
          </div>

          <div className="card p-toolbar-sm">
            <Toolbar
              className="mb-2 "
              left={() => (
                <Button
                  label="+ Nueva Categoría"
                  icon="pi pi-plus"
                  severity="info"
                  className="p-button-sm "
                  style={{ fontSize: "12px" }}
                  onClick={openNew}
                />
              )}
            />

            <DataTable
              ref={dt}
              header={header}
              size={"small"}
              value={categorias}
              selection={selectedCategorias}
              dataKey="id_categoria_mascota"
              paginator
              rows={5}
              globalFilter={globalFilter}
              className="text-xs"
              style={{ fontSize: "14px" }}
            >
              <Column field="descripcion" header="Descripción" sortable />
              <Column field="estado" header="Estado" />
              <Column
                header="Acción"
                body={(rowData: CategoriaMascota) => (
                  <>
                    <Button
                      rounded
                      size="small"
                      outlined
                      className="p-button-xs text-xs "
                      icon={<SquarePen />}
                      style={{
                        fontSize: "10px",
                        height: "40px",
                        width: "40px",
                        padding: "2px",
                        marginRight: "4px",
                      }}
                      onClick={() => editCategoria(rowData)}
                    />

                    <Button
                      icon={<Trash2 />}
                        style={{
                        fontSize: "10px",
                        height: "40px",
                        width: "40px",
                        padding: "2px",
                        marginRight: "4px",
                      }}
                      rounded
                      outlined
                      severity="danger"
                      className="p-button-sm text-sm"
                      onClick={() => confirmDeleteCategoria(rowData)}
                    />
                  </>
                )}
              />
            </DataTable>
          </div>

          <Dialog
            visible={categoriaDialog}
            style={{ width: "25rem" }}
            breakpoints={{ "960px": "60vw", "641px": "85vw" }}
            header="Datos de la Categoría"
            modal
            className="p-fluid"
            footer={categoriaDialogFooter}
            onHide={() => setCategoriaDialog(false)}
          >
            <div className="field">
              <label htmlFor="descripcion" className="font-bold text-sm">
                Descripción
              </label>
              <InputText
                id="descripcion"
                value={categoria.descripcion || ""}
                onChange={(e) =>
                  setCategoria({ ...categoria, descripcion: e.target.value })
                }
                required
                className={classNames("p-inputtext-sm text-sm", {
                  "p-invalid": submitted && !categoria.descripcion,
                })}
              />
              {submitted && !categoria.descripcion && (
                <small className="p-error">
                  La descripción es obligatoria.
                </small>
              )}
            </div>
          </Dialog>

          <Dialog
            visible={deleteCategoriaDialog}
            style={{ width: "25rem" }}
            breakpoints={{ "960px": "60vw", "641px": "85vw" }}
            header="Confirmar"
            modal
            footer={deleteCategoriaDialogFooter}
            onHide={() => setDeleteCategoriaDialog(false)}
          >
            <div className="confirmation-content">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "1.5rem" }}
              />
              {categoria && (
                <span className="text-sm">
                  ¿Estás seguro que deseas eliminar la categoría{" "}
                  <b>{categoria.descripcion}</b>?
                </span>
              )}
            </div>
          </Dialog>
        </div>
      )}
    </>
  );
}
