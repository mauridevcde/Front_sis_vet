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
import { InputNumber } from "primereact/inputnumber";
import { getAllConsultas } from "@/app/_api/consultasClinicas/getAllConsultasClinicas";
import { postConsulta } from "@/app/_api/consultasClinicas/postConsultasClinicas";
import { putConsulta } from "@/app/_api/consultasClinicas/putConsultasClinicas";
import { deleteConsulta } from "@/app/_api/consultasClinicas/deleteConsultasClinicas";
import { getAllClientes } from "@/app/_api/clientes/getAllClientes";
import { getAllVeterinarios } from "@/app/_api/veterinarios/getAllVeterinarios";

import { Search, SquarePen, Trash2 } from "lucide-react";

import { ConsultaClinica } from "@/app/interfaces/consultasClinicas.interface";
import { formatDateForInput, formatDateForMySQL } from "@/app/utils/utils";

export default function ConsultasClinicas() {
  const emptyConsulta: ConsultaClinica = {
    id_consulta: 0,
    id_cliente: 0,
    fecha_consulta: new Date().toISOString().split("T")[0], // Formato yyyy-MM-dd,
    motivo: null,
    sintomas: null,
    diagnostico: null,
    tratamiento: null,
    observaciones: null,
    peso_kg: null,
    temperatura_c: null,
    id_veterinario: 0,
    estado: 1,
  };

  const [consulta, setConsulta] = useState<ConsultaClinica>(emptyConsulta);
  const [consultaDialog, setConsultaDialog] = useState(false);
  const [deleteConsultaDialog, setDeleteConsultaDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState<string | null>(null);
  const [selectedConsultas, setSelectedConsultas] = useState<
    ConsultaClinica[] | null
  >(null);
  const [clienteModal, setClienteModal] = useState(false);
  const [veterinarioModal, setVeterinarioModal] = useState(false);

  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<ConsultaClinica[]>>(null);

  const queryClient = useQueryClient();

  const { data: consultas = [], isLoading } = useQuery({
    queryKey: ["consultas"],
    queryFn: getAllConsultas,
  });

  const { data: clientes = [] } = useQuery({
    queryKey: ["clientes"],
    queryFn: getAllClientes,
  });

  const { data: veterinarios = [] } = useQuery({
    queryKey: ["veterinarios"],
    queryFn: getAllVeterinarios,
  });

  const mutationNewConsulta = useMutation({
    mutationFn: postConsulta,
    onSuccess: () => {
      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: "Consulta creada",
        life: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["consultas"] });
      setConsultaDialog(false);
      setConsulta(emptyConsulta);
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

  const mutationUpdateConsulta = useMutation({
    mutationFn: putConsulta,
    onSuccess: () => {
      toast.current?.show({
        severity: "success",
        summary: "Actualizado",
        detail: "Consulta actualizada",
        life: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["consultas"] });
      setConsultaDialog(false);
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

  const mutationDeleteConsulta = useMutation({
    mutationFn: deleteConsulta,
    onSuccess: () => {
      toast.current?.show({
        severity: "success",
        summary: "Eliminado",
        detail: "Consulta eliminada",
        life: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["consultas"] });
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

  const saveConsulta = () => {
    setSubmitted(true);

    // Validaciones
    if (!consulta.motivo?.trim()) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "El motivo es requerido",
        life: 3000,
      });
      return;
    }

    if (consulta.id_cliente === 0) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Debe seleccionar un cliente",
        life: 3000,
      });
      return;
    }

    if (consulta.id_veterinario === 0) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Debe seleccionar un veterinario",
        life: 3000,
      });
      return;
    }

    const consultaToSave = {
      ...consulta,
      fecha_consulta: formatDateForMySQL(consulta.fecha_consulta),
      peso_kg: consulta.peso_kg !== null ? Number(consulta.peso_kg) : null,
      temperatura_c:
        consulta.temperatura_c !== null ? Number(consulta.temperatura_c) : null,
    };

    if (consulta.id_consulta !== 0) {
      mutationUpdateConsulta.mutate(consultaToSave);
    } else {
      mutationNewConsulta.mutate(consultaToSave);
    }
  };

  const openNew = () => {
    setConsulta(emptyConsulta);
    setSubmitted(false);
    setConsultaDialog(true);
  };

  const editConsulta = (consulta: ConsultaClinica) => {
    setConsulta({
      ...consulta,
      fecha_consulta: formatDateForInput(consulta.fecha_consulta),
      // Aseguramos que los campos numéricos sean números
      peso_kg: consulta.peso_kg !== null ? Number(consulta.peso_kg) : null,
      temperatura_c:
        consulta.temperatura_c !== null ? Number(consulta.temperatura_c) : null,
    });
    setConsultaDialog(true);
  };

  const confirmDeleteConsulta = (consulta: ConsultaClinica) => {
    setConsulta(consulta);
    setDeleteConsultaDialog(true);
  };

  const deleteConsultaConfirmado = () => {
    setDeleteConsultaDialog(false);
    mutationDeleteConsulta.mutate(consulta);
  };

  const onRowSelectCliente = (event: any) => {
    setConsulta({ ...consulta, id_cliente: event.data.id_cliente });
    setClienteModal(false);
  };

  const onRowSelectVeterinario = (event: any) => {
    setConsulta({ ...consulta, id_veterinario: event.data.id_veterinario });
    setVeterinarioModal(false);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const header = (
    <div className="flex justify-between items-center">
      <h4 className="m-0">Gestionar Consultas Clínicas</h4>
      <InputText
        type="search"
        onInput={(e) => setGlobalFilter((e.target as HTMLInputElement).value)}
        placeholder="Buscar..."
      />
    </div>
  );

  return (
    <>
      <Toast ref={toast} />

      <div className="card">
        <div className="p-2 mb-2 bg-gray-100 text-center rounded shadow text-xs">
          <h1 className="text-base font-semibold text-gray-800">
            Consultas Clínicas
          </h1>
        </div>
        <Toolbar
          className="mb-2"
          left={() => (
            <Button
              label="+ Nueva Consulta"
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
            value={consultas}
            selection={selectedConsultas}
            dataKey="id_consulta"
            paginator
            rows={5}
            globalFilter={globalFilter}
            header={header}
          >
            <Column field="motivo" header="Motivo" sortable />
            <Column
              field="fecha_consulta"
              header="Fecha"
              body={(rowData) => formatDate(rowData.fecha_consulta)}
              sortable
            />
            <Column field="diagnostico" header="Diagnóstico" />
            <Column field="tratamiento" header="Tratamiento" />

            <Column
              header="Acción"
              body={(rowData: ConsultaClinica) => (
                <>
                  <Button
                    icon={<SquarePen size={16} />}
                    rounded
                    outlined
                    size="small"
                    className="mr-1 p-2 text-xs"
                    onClick={() => editConsulta(rowData)}
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
                    onClick={() => confirmDeleteConsulta(rowData)}
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
        visible={consultaDialog}
        style={{ width: "32rem" }}
        header="Detalles de la Consulta"
        modal
        className="p-fluid"
        onHide={() => setConsultaDialog(false)}
      >
        <div className="field">
          <label htmlFor="motivo">Motivo*</label>
          <InputText
            id="motivo"
            value={consulta.motivo || ""}
            onChange={(e) =>
              setConsulta({ ...consulta, motivo: e.target.value })
            }
            autoFocus={true}
            required
            className={submitted && !consulta.motivo ? "p-invalid" : ""}
          />
          {submitted && !consulta.motivo && (
            <small className="p-error">El motivo es requerido.</small>
          )}
        </div>

        <div className="field">
          <label htmlFor="fecha_consulta">Fecha*</label>
          <InputText
            id="fecha_consulta"
            type="date"
            value={formatDateForInput(consulta.fecha_consulta)}
            onChange={(e) => {
              setConsulta({
                ...consulta,
                fecha_consulta: e.target.value,
              });
            }}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="sintomas">Síntomas</label>
          <InputText
            id="sintomas"
            value={consulta.sintomas || ""}
            onChange={(e) =>
              setConsulta({ ...consulta, sintomas: e.target.value })
            }
          />
        </div>

        <div className="field">
          <label htmlFor="diagnostico">Diagnóstico</label>
          <InputText
            id="diagnostico"
            value={consulta.diagnostico || ""}
            onChange={(e) =>
              setConsulta({ ...consulta, diagnostico: e.target.value })
            }
          />
        </div>

        <div className="field">
          <label htmlFor="tratamiento">Tratamiento</label>
          <InputText
            id="tratamiento"
            value={consulta.tratamiento || ""}
            onChange={(e) =>
              setConsulta({ ...consulta, tratamiento: e.target.value })
            }
          />
        </div>

        <div className="field">
          <label htmlFor="observaciones">Observaciones</label>
          <InputText
            id="observaciones"
            value={consulta.observaciones || ""}
            onChange={(e) =>
              setConsulta({ ...consulta, observaciones: e.target.value })
            }
          />
        </div>

        <div className="field">
          <label htmlFor="peso_kg">Peso (kg)</label>
          <InputNumber
            id="peso_kg"
            value={consulta.peso_kg ?? null}
            onValueChange={(e) =>
              setConsulta({ ...consulta, peso_kg: e.value })
            }
            mode="decimal"
            minFractionDigits={2}
            maxFractionDigits={2}
            min={0}
            // Aseguramos que el valor siempre sea numérico o null
            onChange={(e) => {
              const value = e.value;
              setConsulta({
                ...consulta,
                peso_kg: value !== null ? Number(value) : null,
              });
            }}
          />
        </div>

        <div className="field">
          <label htmlFor="temperatura_c">Temperatura (°C)</label>
          <InputNumber
            id="temperatura_c"
            value={consulta.temperatura_c ?? null}
            onValueChange={(e) =>
              setConsulta({ ...consulta, temperatura_c: e.value })
            }
            mode="decimal"
            minFractionDigits={1}
            maxFractionDigits={1}
            min={0}
            // Aseguramos que el valor siempre sea numérico o null
            onChange={(e) => {
              const value = e.value;
              setConsulta({
                ...consulta,
                temperatura_c: value !== null ? Number(value) : null,
              });
            }}
          />
        </div>

        <div className="field">
          <label htmlFor="id_cliente">Cliente*</label>
          <div className="p-inputgroup">
            <InputText id="id_cliente" value={consulta.id_cliente} disabled />
            <Button
              onClick={() => setClienteModal(true)}
              icon=<Search />
              className="p-button-warning"
            />
          </div>
          {submitted && consulta.id_cliente === 0 && (
            <small className="p-error">Debe seleccionar un cliente.</small>
          )}
        </div>

        <div className="field">
          <label htmlFor="id_veterinario">Veterinario*</label>
          <div className="p-inputgroup">
            <InputText
              id="id_veterinario"
              value={consulta.id_veterinario}
              disabled
            />
            <Button
              onClick={() => setVeterinarioModal(true)}
              icon=<Search />
              className="p-button-warning"
            />
          </div>
          {submitted && consulta.id_veterinario === 0 && (
            <small className="p-error">Debe seleccionar un veterinario.</small>
          )}
        </div>

        <br />
        <div className="field">
          <Button label="Guardar" icon="pi pi-check" onClick={saveConsulta} />
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
        visible={deleteConsultaDialog}
        header="Confirmar Eliminación"
        modal
        onHide={() => setDeleteConsultaDialog(false)}
      >
        <p>
          ¿Deseas eliminar la consulta <strong>{consulta.motivo}</strong>?
        </p>
        <Button
          label="Sí"
          icon="pi pi-check"
          onClick={deleteConsultaConfirmado}
        />
        <Button
          label="No"
          icon="pi pi-times"
          onClick={() => setDeleteConsultaDialog(false)}
        />
      </Dialog>
    </>
  );
}
