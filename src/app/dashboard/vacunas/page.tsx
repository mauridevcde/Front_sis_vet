"use client";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import React, { useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Toast } from "primereact/toast";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toolbar } from "primereact/toolbar";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { getAllVacunas } from "@/app/_api/vacunas/getAllVacunas";
import { postVacuna } from "@/app/_api/vacunas/postVacunas";
import { putVacuna } from "@/app/_api/vacunas/putVacunas";
import { deleteVacuna } from "@/app/_api/vacunas/deleteVacunas";
import { getAllClientes } from "@/app/_api/clientes/getAllClientes";
import { getAllVeterinarios } from "@/app/_api/veterinarios/getAllVeterinarios";

import { Search, SquarePen, Trash2 } from "lucide-react";

import { Vacuna } from "@/app/interfaces/vacunas.interface";
import { formatDateForInput, formatDateForMySQL } from "@/app/utils/utils";

export default function Vacunas() {
  const emptyVacuna: Vacuna = {
    id_vacuna: 0,
    id_cliente: 0,
    nombre_vacuna: "",
    fecha_aplicacion: new Date().toISOString().split("T")[0], // Formato yyyy-MM-dd,
    proxima_dosis: "",
    id_veterinario: 0,
    estado: true,
  };

  const [vacuna, setVacuna] = useState<Vacuna>(emptyVacuna);
  const [vacunaDialog, setVacunaDialog] = useState(false);
  const [deleteVacunaDialog, setDeleteVacunaDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState<string | null>(null);
  const [selectedVacunas, setSelectedVacunas] = useState<Vacuna[] | null>(null);
  const [clienteModal, setClienteModal] = useState(false);
  const [veterinarioModal, setVeterinarioModal] = useState(false);

  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<Vacuna[]>>(null);

  const queryClient = useQueryClient();

  const { data: vacunas = [], isLoading } = useQuery({
    queryKey: ["vacunas"],
    queryFn: getAllVacunas,
  });

  const { data: clientes = [] } = useQuery({
    queryKey: ["clientes"],
    queryFn: getAllClientes,
  });

  const { data: veterinarios = [] } = useQuery({
    queryKey: ["veterinarios"],
    queryFn: getAllVeterinarios,
  });

  const mutationNewVacuna = useMutation({
    mutationFn: postVacuna,
    onSuccess: () => {
      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: "Vacuna creada",
        life: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["vacunas"] });
      setVacunaDialog(false);
      setVacuna(emptyVacuna);
    },
    onError: (error: any) => {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: error.message,
        life: 3000,
      });
    },
  });

  const mutationUpdateVacuna = useMutation({
    mutationFn: putVacuna,
    onSuccess: () => {
      toast.current?.show({
        severity: "success",
        summary: "Actualizado",
        detail: "Vacuna actualizada",
        life: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["vacunas"] });
      setVacunaDialog(false);
    },
    onError: (error: any) => {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: error.message,
        life: 3000,
      });
    },
  });

  const mutationDeleteVacuna = useMutation({
    mutationFn: deleteVacuna,
    onSuccess: () => {
      toast.current?.show({
        severity: "success",
        summary: "Eliminado",
        detail: "Vacuna eliminada",
        life: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["vacunas"] });
    },
    onError: (error: any) => {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: error.message,
        life: 3000,
      });
    },
  });

  const saveVacuna = () => {
    setSubmitted(true);

    if (vacuna.nombre_vacuna?.trim()) {
      const vacunaToSave = {
        ...vacuna,
        fecha_aplicacion: formatDateForMySQL(vacuna.fecha_aplicacion),
        proxima_dosis: vacuna.proxima_dosis
          ? formatDateForMySQL(vacuna.proxima_dosis)
          : null,
      };

      if (vacuna.id_vacuna !== 0) {
        mutationUpdateVacuna.mutate(vacunaToSave);
      } else {
        mutationNewVacuna.mutate(vacunaToSave);
      }
    }
  };

  const openNew = () => {
    setVacuna(emptyVacuna);
    setSubmitted(false);
    setVacunaDialog(true);
  };

  const editVacuna = (vacuna: Vacuna) => {
    setVacuna({
      ...vacuna,
      fecha_aplicacion: formatDateForInput(vacuna.fecha_aplicacion),
      proxima_dosis: vacuna.proxima_dosis
        ? formatDateForInput(vacuna.proxima_dosis)
        : null,
    });

    setVacunaDialog(true);
  };

  const confirmDeleteVacuna = (vacuna: Vacuna) => {
    setVacuna(vacuna);
    setDeleteVacunaDialog(true);
  };

  const deleteVacunaConfirmado = () => {
    setDeleteVacunaDialog(false);
    mutationDeleteVacuna.mutate(vacuna);
  };

  const onRowSelectCliente = (event: any) => {
    setVacuna({ ...vacuna, id_cliente: event.data.id_cliente });
    setClienteModal(false);
  };

  const onRowSelectVeterinario = (event: any) => {
    setVacuna({ ...vacuna, id_veterinario: event.data.id_veterinario });
    setVeterinarioModal(false);
  };

  const header = (
    <div className="flex justify-between items-center">
      <h4 className="m-0">Gestionar Vacunas</h4>
      <InputText
        type="search"
        onInput={(e) => setGlobalFilter((e.target as HTMLInputElement).value)}
        placeholder="Buscar..."
      />
    </div>
  );

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <>
      <Toast ref={toast} />

      <div className="card">
        <div className="p-2 mb-2 bg-gray-100 text-center rounded shadow text-xs">
          <h1 className="text-base font-semibold text-gray-800">Vacunas</h1>
        </div>
        <Toolbar
          className="mb-2"
          left={() => (
            <Button
              label="+ Nueva Vacuna"
              icon="pi pi-plus"
              onClick={openNew}
            />
          )}
        />
        {isLoading ? (
          <div>Cargando...</div>
        ) : (
          <DataTable
            ref={dt}
            value={vacunas}
            selection={selectedVacunas}
            dataKey="id_vacuna"
            paginator
            rows={5}
            globalFilter={globalFilter}
            header={header}
          >
            <Column field="nombre_vacuna" header="Nombre de Vacuna" sortable />
            <Column
              field="fecha_aplicacion"
              header="Fecha de Aplicación"
              body={(rowData) => formatDate(rowData.fecha_aplicacion)}
              sortable
            />
            <Column
              field="proxima_dosis"
              header="Próxima Dosis"
              body={(rowData) => formatDate(rowData.proxima_dosis)}
              sortable
            />

            <Column
              header="Acción"
              body={(rowData: Vacuna) => (
                <>
                  <Button
                    icon={<SquarePen size={16} />}
                    rounded
                    outlined
                    size="small"
                    className="mr-1 p-2 text-xs"
                    onClick={() => editVacuna(rowData)}
                    style={{
                      fontSize: "10px",
                      height: "40px",
                      width: "40px",
                      padding: "2px",
                      marginRight: "4px",
                    }}
                  />
                  <Button
                    icon={<Trash2 size={16} />}
                    rounded
                    outlined
                    severity="danger"
                    size="small"
                    className="p-2 text-xs"
                    onClick={() => confirmDeleteVacuna(rowData)}
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
            />
          </DataTable>
        )}
      </div>

      <Dialog
        visible={vacunaDialog}
        style={{ width: "22rem" }}
        header="Detalles de la Vacuna"
        modal
        className="p-fluid"
        onHide={() => setVacunaDialog(false)}
      >
        <div className="field">
          <label htmlFor="nombre_vacuna">Nombre de Vacuna</label>
          <InputText
            id="nombre_vacuna"
            value={vacuna.nombre_vacuna || ""}
            onChange={(e) =>
              setVacuna({ ...vacuna, nombre_vacuna: e.target.value })
            }
            autoFocus={true}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="fecha_aplicacion">Fecha de Aplicación</label>
          <InputText
            id="fecha_aplicacion"
            type="date"
            value={formatDateForInput(vacuna.fecha_aplicacion)}
            onChange={(e) => {
              setVacuna({
                ...vacuna,
                fecha_aplicacion: e.target.value,
              });
            }}
          />
        </div>

        <div className="field">
          <label htmlFor="proxima_dosis">Próxima Dosis</label>
          <InputText
            id="proxima_dosis"
            type="date"
            value={
              vacuna.proxima_dosis
                ? formatDateForInput(vacuna.proxima_dosis)
                : ""
            }
            onChange={(e) => {
              setVacuna({
                ...vacuna,
                proxima_dosis: e.target.value,
              });
            }}
          />
        </div>

        <div className="field">
          <label htmlFor="id_cliente">Cliente</label>
          <div className="p-inputgroup">
            <InputText id="id_cliente" value={vacuna.id_cliente} disabled />
            <Button
              onClick={() => setClienteModal(true)}
              icon=<Search />
              className="p-button-warning"
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="id_veterinario">Veterinario</label>
          <div className="p-inputgroup">
            <InputText
              id="id_veterinario"
              value={vacuna.id_veterinario}
              disabled
            />
            <Button
              onClick={() => setVeterinarioModal(true)}
              icon=<Search />
              className="p-button-warning"
            />
          </div>
        </div>

        <br />
        <div className="field">
          <Button label="Guardar" icon="pi pi-check" onClick={saveVacuna} />
        </div>
      </Dialog>

      <Dialog
        visible={clienteModal}
        header="Seleccionar Cliente"
        modal
        style={{ width: "50vw" }}
        onHide={() => setClienteModal(false)}
      >
        <DataTable
          value={clientes}
          selectionMode="single"
          onRowSelect={onRowSelectCliente}
          dataKey="id_cliente"
        >
          <Column field="nombre_apellido" header="Nombre y Apellido" />
          <Column field="ci" header="Cedula" />
        </DataTable>
      </Dialog>

      <Dialog
        visible={veterinarioModal}
        header="Seleccionar Veterinario"
        modal
        style={{ width: "50vw" }}
        onHide={() => setVeterinarioModal(false)}
      >
        <DataTable
          value={veterinarios}
          selectionMode="single"
          onRowSelect={onRowSelectVeterinario}
          dataKey="id_veterinario"
        >
          <Column field="nombre_apellido" header="Nombre y Apellido" />
          <Column field="especialidad" header="Especialidad" />
        </DataTable>
      </Dialog>

      <Dialog
        visible={deleteVacunaDialog}
        header="Confirmar Eliminación"
        modal
        onHide={() => setDeleteVacunaDialog(false)}
      >
        <p>
          ¿Deseas eliminar la vacuna <strong>{vacuna.nombre_vacuna}</strong>?
        </p>
        <Button
          label="Sí"
          icon="pi pi-check"
          onClick={deleteVacunaConfirmado}
        />
        <Button
          label="No"
          icon="pi pi-times"
          onClick={() => setDeleteVacunaDialog(false)}
        />
      </Dialog>
    </>
  );
}
