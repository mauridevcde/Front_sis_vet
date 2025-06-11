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
import { Calendar } from "primereact/calendar";
import { Checkbox } from "primereact/checkbox";
import { getAllRegistrosClinicos } from "@/app/_api/registrosClinicos/getAllRegistroClinicos";
import { postRegistroClinico } from "@/app/_api/registrosClinicos/postRegistroClinicos";
import { putRegistroClinico } from "@/app/_api/registrosClinicos/putRegistrosClinicos";
import { deleteRegistroClinico } from "@/app/_api/registrosClinicos/deleteRegistrosClinicos";
import { getAllClientes } from "@/app/_api/clientes/getAllClientes";

import { Search, SquarePen, Trash2 } from "lucide-react";

import { RegistroClinico } from "@/app/interfaces/registroClinicos.interfaces";
import { formatDateForInput, formatDateForMySQL } from "@/app/utils/utils";

export default function RegistrosClinicos() {
  const emptyRegistro: RegistroClinico = {
    id_registro_clinico: 0,
    Descripcion: null,
    fecha: new Date().toISOString().split("T")[0], // Formato yyyy-MM-dd
    id_cliente: 0,
    estado: true,
  };

  const [registro, setRegistro] = useState<RegistroClinico>(emptyRegistro);
  const [registroDialog, setRegistroDialog] = useState(false);
  const [deleteRegistroDialog, setDeleteRegistroDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState<string | null>(null);
  const [selectedRegistros, setSelectedRegistros] = useState<
    RegistroClinico[] | null
  >(null);
  const [clienteModal, setClienteModal] = useState(false);
  // Estado para manejar la fecha como Date (para el Calendar)
  const [fechaDate, setFechaDate] = useState<Date | null>(new Date());

  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<RegistroClinico[]>>(null);

  const queryClient = useQueryClient();

  const { data: registros = [], isLoading } = useQuery({
    queryKey: ["registros-clinicos"],
    queryFn: getAllRegistrosClinicos,
  });

  const { data: clientes = [] } = useQuery({
    queryKey: ["clientes"],
    queryFn: getAllClientes,
  });

  const mutationNewRegistro = useMutation({
    mutationFn: postRegistroClinico,
    onSuccess: () => {
      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: "Registro clínico creado",
        life: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["registros-clinicos"] });
      setRegistroDialog(false);
      setRegistro(emptyRegistro);
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

  const mutationUpdateRegistro = useMutation({
    mutationFn: putRegistroClinico,
    onSuccess: () => {
      toast.current?.show({
        severity: "success",
        summary: "Actualizado",
        detail: "Registro clínico actualizado",
        life: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["registros-clinicos"] });
      setRegistroDialog(false);
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

  const mutationDeleteRegistro = useMutation({
    mutationFn: deleteRegistroClinico,
    onSuccess: () => {
      toast.current?.show({
        severity: "success",
        summary: "Eliminado",
        detail: "Registro clínico eliminado",
        life: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["registros-clinicos"] });
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

  const saveRegistro = () => {
    setSubmitted(true);

    // Validaciones
    if (registro.id_cliente === 0) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Debe seleccionar un cliente",
        life: 3000,
      });
      return;
    }

    const registroToSave = {
      ...registro,
      fecha: fechaDate
        ? formatDateForMySQL(fechaDate.toISOString().split("T")[0])
        : null,
    };

    if (registro.id_registro_clinico !== 0) {
      mutationUpdateRegistro.mutate(registroToSave);
    } else {
      mutationNewRegistro.mutate(registroToSave);
    }
  };

  const openNew = () => {
    setRegistro(emptyRegistro);
    setSubmitted(false);
    setRegistroDialog(true);
  };

  const editRegistro = (registro: RegistroClinico) => {
    setRegistro({
      ...registro,
      // Mantenemos el formato string para el estado principal
    });
    // Parseamos la fecha a objeto Date para el Calendar
    setFechaDate(registro.fecha ? new Date(registro.fecha) : null);
    setRegistroDialog(true);
  };

  const confirmDeleteRegistro = (registro: RegistroClinico) => {
    setRegistro(registro);
    setDeleteRegistroDialog(true);
  };

  const deleteRegistroConfirmado = () => {
    setDeleteRegistroDialog(false);
    mutationDeleteRegistro.mutate(registro);
  };

  const onRowSelectCliente = (event: any) => {
    setRegistro({ ...registro, id_cliente: event.data.id_cliente });
    setClienteModal(false);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const header = (
    <div className="flex justify-between items-center">
      <h4 className="m-0">Gestionar Registros Clínicos</h4>
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
            Registros Clínicos
          </h1>
        </div>
        <Toolbar
          className="mb-2"
          left={() => (
            <Button
              label="+ Nuevo Registro"
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
            value={registros}
            selection={selectedRegistros}
            dataKey="id_registro_clinico"
            paginator
            rows={5}
            globalFilter={globalFilter}
            header={header}
          >
            <Column field="Descripcion" header="Descripción" sortable />
            <Column
              field="fecha"
              header="Fecha"
              body={(rowData) => formatDate(rowData.fecha)}
              sortable
            />

            <Column
              header="Acción"
              body={(rowData: RegistroClinico) => (
                <>
                  <Button
                    icon={<SquarePen size={16} />}
                    rounded
                    outlined
                    size="small"
                    className="mr-1 p-2 text-xs"
                    onClick={() => editRegistro(rowData)}
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
                    onClick={() => confirmDeleteRegistro(rowData)}
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
        visible={registroDialog}
        style={{ width: "32rem" }}
        header="Detalles del Registro Clínico"
        modal
        className="p-fluid"
        onHide={() => {
          setRegistroDialog(false);
          // Restablecemos la fecha al cerrar el diálogo
          setFechaDate(registro.fecha ? new Date(registro.fecha) : new Date());
        }}
      >
        <div className="field">
          <label htmlFor="Descripcion">Descripción</label>
          <InputText
            id="Descripcion"
            value={registro.Descripcion || ""}
            onChange={(e) =>
              setRegistro({ ...registro, Descripcion: e.target.value })
            }
          />
        </div>

        <div className="field">
          <label htmlFor="fecha">Fecha</label>
          <Calendar
            id="fecha"
            value={fechaDate}
            onChange={(e) => {
              // Actualizamos el estado de la fecha (como Date)
              setFechaDate(e.value as Date);
              // También actualizamos el estado principal (como string)
              setRegistro({
                ...registro,
                fecha: e.value
                  ? (e.value as Date).toISOString().split("T")[0]
                  : null,
              });
            }}
            dateFormat="dd/mm/yy"
            showIcon
            required
          />
        </div>

        <div className="field">
          <label htmlFor="id_cliente">Cliente*</label>
          <div className="p-inputgroup">
            <InputText
              id="id_cliente"
              value={registro.id_cliente.toString()}
              disabled
            />
            <Button
              onClick={() => setClienteModal(true)}
              icon=<Search />
              className="p-button-warning"
            />
          </div>
          {submitted && registro.id_cliente === 0 && (
            <small className="p-error">Debe seleccionar un cliente.</small>
          )}
        </div>

        <br />
        <div className="field">
          <Button label="Guardar" icon="pi pi-check" onClick={saveRegistro} />
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
        visible={deleteRegistroDialog}
        header="Confirmar Eliminación"
        modal
        onHide={() => setDeleteRegistroDialog(false)}
      >
        <p>
          ¿Deseas eliminar el registro clínico{" "}
          <strong>{registro.Descripcion || "sin descripción"}</strong>?
        </p>
        <Button
          label="Sí"
          icon="pi pi-check"
          onClick={deleteRegistroConfirmado}
        />
        <Button
          label="No"
          icon="pi pi-times"
          onClick={() => setDeleteRegistroDialog(false)}
        />
      </Dialog>
    </>
  );
}
