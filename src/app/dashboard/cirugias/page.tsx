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
import { getAllCirugias } from "@/app/_api/cirugias/getAllCirugias";
import { postCirugia } from "@/app/_api/cirugias/postCirugias";
import { putCirugia } from "@/app/_api/cirugias/putCirugias";
import { deleteCirugia } from "@/app/_api/cirugias/deleteCirugias";
import { getAllClientes } from "@/app/_api/clientes/getAllClientes";
import { getAllVeterinarios } from "@/app/_api/veterinarios/getAllVeterinarios";
import { useAuthStore } from "@/app/_store/authStore";
import { Search, SquarePen, Trash2 } from "lucide-react";
import { Dropdown } from "primereact/dropdown";

interface Cirugia {
  id_cirugia: number;
  id_cliente: number;
  fecha_cirugia: string | null;
  tipo_cirugia: string | null;
  observaciones: string | null;
  id_veterinario: number;
  estado: boolean | null;
}

interface AuthStore {
  id_usuario: number;
}

export default function Cirugias() {
  const { id_usuario } = useAuthStore() as AuthStore;
  const emptyCirugia: Cirugia = {
    id_cirugia: 0,
    id_cliente: 0,
    fecha_cirugia: null,
    tipo_cirugia: null,
    observaciones: null,
    id_veterinario: 0,
    estado: true,
  };

  const [cirugia, setCirugia] = useState<Cirugia>(emptyCirugia);
  const [cirugiaDialog, setCirugiaDialog] = useState(false);
  const [deleteCirugiaDialog, setDeleteCirugiaDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState<string | null>(null);
  const [selectedCirugias, setSelectedCirugias] = useState<Cirugia[] | null>(
    null
  );
  const [clienteModal, setClienteModal] = useState(false);
  const [veterinarioModal, setVeterinarioModal] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [selectedVeterinario, setSelectedVeterinario] = useState(null);

  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<Cirugia[]>>(null);

  const queryClient = useQueryClient();

  const { data: cirugias = [], isLoading } = useQuery({
    queryKey: ["cirugias"],
    queryFn: getAllCirugias,
  });

  const { data: clientes = [] } = useQuery({
    queryKey: ["clientes"],
    queryFn: getAllClientes,
  });

  const { data: veterinarios = [] } = useQuery({
    queryKey: ["veterinarios"],
    queryFn: getAllVeterinarios,
  });

  const mutationNewCirugia = useMutation({
    mutationFn: postCirugia,
    onSuccess: () => {
      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: "Cirugía creada",
        life: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["cirugias"] });
      setCirugiaDialog(false);
      setCirugia(emptyCirugia);
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

  const mutationUpdateCirugia = useMutation({
    mutationFn: putCirugia,
    onSuccess: () => {
      toast.current?.show({
        severity: "success",
        summary: "Actualizado",
        detail: "Cirugía actualizada",
        life: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["cirugias"] });
      setCirugiaDialog(false);
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

  const mutationDeleteCirugia = useMutation({
    mutationFn: deleteCirugia,
    onSuccess: () => {
      toast.current?.show({
        severity: "success",
        summary: "Eliminado",
        detail: "Cirugía eliminada",
        life: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["cirugias"] });
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

  const saveCirugia = () => {
    setSubmitted(true);
    if (cirugia.tipo_cirugia?.trim()) {
      if (cirugia.id_cirugia !== 0) {
        mutationUpdateCirugia.mutate(cirugia);
      } else {
        mutationNewCirugia.mutate(cirugia);
      }
    }
  };

  const openNew = () => {
    setCirugia(emptyCirugia);
    setSubmitted(false);
    setCirugiaDialog(true);
  };

  const editCirugia = (cirugia: Cirugia) => {
   // setCirugia({ ...cirugia });
    setCirugia({ ...cirugia, fecha_cirugia: 'hello'})
    console.log("ejecutando el editing: ", cirugia);

    setCirugiaDialog(true);
  };

  const confirmDeleteCirugia = (cirugia: Cirugia) => {
    setCirugia(cirugia);
    setDeleteCirugiaDialog(true);
  };

  const deleteCirugiaConfirmado = () => {
    setDeleteCirugiaDialog(false);
    mutationDeleteCirugia.mutate(cirugia);
  };

  const onRowSelectCliente = (event: any) => {
    setCirugia({ ...cirugia, id_cliente: event.data.id_cliente });
    setClienteModal(false);
  };

  const onRowSelectVeterinario = (event: any) => {
    setCirugia({ ...cirugia, id_veterinario: event.data.id_veterinario });
    setVeterinarioModal(false);
  };

  const header = (
    <div className="flex justify-between items-center">
      <h4 className="m-0">Gestionar Cirugías</h4>
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
    console.log("ejecutando el formatDate", date.toISOString());

    return date.toLocaleDateString();
  };
  



  return (
    <>
      <Toast ref={toast} />
      <div className="card">
        <Toolbar
          className="mb-2"
          left={() => (
            <Button
              label="+ Nueva Cirugía"
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
            value={cirugias}
            selection={selectedCirugias}
            dataKey="id_cirugia"
            paginator
            rows={5}
            globalFilter={globalFilter}
            header={header}
          >
            <Column field="tipo_cirugia" header="Tipo de Cirugía" sortable />
            <Column
              field="fecha_cirugia"
              header="Fecha"
              body={(rowData) => formatDate(rowData.fecha_cirugia)}
            />
            <Column field="observaciones" header="Observaciones" />

            <Column
              header="Acción"
              body={(rowData: Cirugia) => (
                <>
                  <Button
                    icon={<SquarePen size={16} />}
                    rounded
                    outlined
                    size="small"
                    className="mr-1 p-2 text-xs"
                    onClick={() => editCirugia(rowData)}
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
                    onClick={() => confirmDeleteCirugia(rowData)}
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
        visible={cirugiaDialog}
        style={{ width: "22rem" }}
        header="Detalles de la Cirugía"
        modal
        className="p-fluid"
        onHide={() => setCirugiaDialog(false)}
      >
        <div className="field">
          <label htmlFor="tipo_cirugia">Tipo de Cirugía</label>
          <InputText
            id="tipo_cirugia"
            value={cirugia.tipo_cirugia || ""}
            onChange={(e) =>
              setCirugia({ ...cirugia, tipo_cirugia: e.target.value })
            }
            autoFocus={true}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="fecha_cirugia">Fecha</label>
          <InputText
            id="fecha_cirugia"
            type="date"
            value={cirugia.fecha_cirugia || ""}
            onChange={(e) =>
              setCirugia({ ...cirugia, fecha_cirugia: e.target.value })
            }
          />
        </div>

        <div className="field">
          <label htmlFor="observaciones">Observaciones</label>
          <InputText
            id="observaciones"
            value={cirugia.observaciones || ""}
            onChange={(e) =>
              setCirugia({ ...cirugia, observaciones: e.target.value })
            }
          />
        </div>

        <div className="field">
          <label htmlFor="id_cliente">Cliente</label>
          <div className="p-inputgroup">
            <InputText id="id_cliente" value={cirugia.id_cliente} disabled />
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
              value={cirugia.id_veterinario}
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
          <Button label="Guardar" icon="pi pi-check" onClick={saveCirugia} />
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
        visible={deleteCirugiaDialog}
        header="Confirmar Eliminación"
        modal
        onHide={() => setDeleteCirugiaDialog(false)}
      >
        <p>
          ¿Deseas eliminar la cirugía <strong>{cirugia.tipo_cirugia}</strong>?
        </p>
        <Button
          label="Sí"
          icon="pi pi-check"
          onClick={deleteCirugiaConfirmado}
        />
        <Button
          label="No"
          icon="pi pi-times"
          onClick={() => setDeleteCirugiaDialog(false)}
        />
      </Dialog>
    </>
  );
}
