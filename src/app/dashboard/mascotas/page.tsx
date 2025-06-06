// Adaptación del componente "Productos" a "Mascotas"
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
import { getAllMascotas } from "@/app/_api/mascotas/getAllMascotas";
import { postMascota } from "@/app/_api/mascotas/postMascotas";
import { putMascota } from "@/app/_api/mascotas/putMascotas";
import { deleteMascota } from "@/app/_api/mascotas/deleteMascotas";
import { getAllCategorias } from "@/app/_api/categMascotas/getAllCatMascotas";
import { getAllClientes } from "@/app/_api/clientes/getAllClientes";
import { useAuthStore } from "@/app/_store/authStore";
import { Search, SquarePen, Trash2 } from "lucide-react";
import { Dropdown } from "primereact/dropdown";

interface Mascota {
  id_mascota: number;
  nombre: string;
  id_categoria_animal: number;
  raza: string;
  sexo: number;
  estado: number;
  id_cliente: number;
}

interface AuthStore {
  id_usuario: number;
}

export default function Mascotas() {
  const { id_usuario } = useAuthStore() as AuthStore;
  const emptyMascota: Mascota = {
    id_mascota: 0,
    nombre: "",
    id_categoria_animal: 0,
    raza: "",
    sexo: 0,
    estado: 1,
    id_cliente: 0,
  };

  const [mascota, setMascota] = useState<Mascota>(emptyMascota);
  const [mascotaDialog, setMascotaDialog] = useState(false);
  const [deleteMascotaDialog, setDeleteMascotaDialog] = useState(false);
  const [selectedSexo, setSelectedSexo] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState<string | null>(null);
  const [selectedMascotas, setSelectedMascotas] = useState<Mascota[] | null>(
    null
  );
  const [categoriaModal, setCategoriaModal] = useState(false);
  const [clienteModal, setClienteModal] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [selectedCliente, setSelectedCliente] = useState(null);

  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<Mascota[]>>(null);

  const queryClient = useQueryClient();

  const { data: mascotas = [], isLoading } = useQuery({
    queryKey: ["mascotas"],
    queryFn: getAllMascotas,
  });

  const { data: categorias = [] } = useQuery({
    queryKey: ["categorias"],
    queryFn: getAllCategorias,
  });

  const { data: clientes = [] } = useQuery({
    queryKey: ["clientes"],
    queryFn: getAllClientes,
  });

  const mutationNewMascota = useMutation({
    mutationFn: postMascota,
    onSuccess: () => {
      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: "Mascota creada",
        life: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["mascotas"] });
      setMascotaDialog(false);
      setMascota(emptyMascota);
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

  const mutationUpdateMascota = useMutation({
    mutationFn: putMascota,
    onSuccess: () => {
      toast.current?.show({
        severity: "success",
        summary: "Actualizado",
        detail: "Mascota actualizada",
        life: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["mascotas"] });
      setMascotaDialog(false);
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

  const mutationDeleteMascota = useMutation({
    mutationFn: deleteMascota,
    onSuccess: () => {
      toast.current?.show({
        severity: "success",
        summary: "Eliminado",
        detail: "Mascota eliminada",
        life: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["mascotas"] });
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

  const saveMascota = () => {
    setSubmitted(true);
    if (mascota.nombre.trim()) {
      if (mascota.id_mascota !== 0) {
        mutationUpdateMascota.mutate(mascota);
      } else {
        mutationNewMascota.mutate(mascota);
      }
    }
  };

  const openNew = () => {
    setMascota(emptyMascota);
    setSubmitted(false);
    setMascotaDialog(true);
  };

  const editMascota = (mascota: Mascota) => {
    setSelectedSexo("");
    setMascota({ ...mascota });
    console.log(mascota);

    console.log(mascota.sexo == 0 ? "Hembra" : "Macho");

    setSelectedSexo(
      mascota.sexo == 0
        ? { sexo: "Hembra", valor: "0" }
        : { sexo: "Macho", valor: "1" }
    );
    setMascotaDialog(true);
  };

  const confirmDeleteMascota = (mascota: Mascota) => {
    setMascota(mascota);
    setDeleteMascotaDialog(true);
  };

  const deleteMascotaConfirmado = () => {
    setDeleteMascotaDialog(false);
    mutationDeleteMascota.mutate(mascota);
  };

  const onRowSelectCategoria = (event: any) => {
    setMascota({
      ...mascota,
      id_categoria_animal: Number(event.data.id_categoria_mascota),
    });
    setCategoriaModal(false);
    toast.current?.show({
      severity: "info",
      summary: "Categoria Seleccionada!",
      detail: `Nombre: ${event.data.descripcion}`,
      life: 3000,
    });
  };

  const onRowSelectCliente = (event: any) => {
    setMascota({ ...mascota, id_cliente: event.data.id_cliente });
    setClienteModal(false);
  };

  const header = (
    <div className="flex justify-between items-center">
      <h4 className="m-0">Gestionar Mascotas</h4>
      <InputText
        type="search"
        onInput={(e) => setGlobalFilter((e.target as HTMLInputElement).value)}
        placeholder="Buscar..."
      />
    </div>
  );

  const filterSexo = (rowData: any) => {
    return <>{rowData.sexo == 1 ? <div>Macho</div> : <div>Hembra</div>}</>;
  };

  return (
    <>
      <Toast ref={toast} />
      <div className="card">
        <Toolbar
          className="mb-2"
          left={() => (
            <Button
              label="+ Nueva Mascota"
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
            value={mascotas}
            selection={selectedMascotas}
            dataKey="id_mascota"
            paginator
            rows={5}
            globalFilter={globalFilter}
            header={header}
          >
            <Column field="nombre" header="Nombre" sortable />
            <Column field="raza" header="Raza" />
            <Column field="sexo" body={filterSexo} header="Sexo" />

            <Column
              header="Acción"
              body={(rowData: Mascota) => (
                <>
                  <Button
                    icon={<SquarePen size={16} />}
                    rounded
                    outlined
                    size="small"
                    className="mr-1 p-2 text-xs"
                    onClick={() => editMascota(rowData)}
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
                    onClick={() => confirmDeleteMascota(rowData)}
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
        visible={mascotaDialog}
        style={{ width: "22rem" }}
        header="Detalles de la Mascota"
        modal
        className="p-fluid"
        onHide={() => setMascotaDialog(false)}
      >
        <div className="field">
          <label htmlFor="nombre">Nombre</label>
          <InputText
            id="nombre"
            value={mascota.nombre}
            onChange={(e) => setMascota({ ...mascota, nombre: e.target.value })}
            autoFocus={true}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="id_categoria_animal">Categoría Animal</label>
          <div className="p-inputgroup flex-1">
            <InputText
              id="id_categoria_animal"
              value={mascota.id_categoria_animal}
              disabled
              placeholder="Busca el tipo animal"
            />
            <Button
              onClick={() => setCategoriaModal(true)}
              icon=<Search />
              className="p-button-warning"
            />
          </div>
        </div>
        <div className="field">
          <label htmlFor="raza">Raza</label>
          <InputText
            id="raza"
            value={mascota.raza}
            onChange={(e) => setMascota({ ...mascota, raza: e.target.value })}
          />
        </div>

        <div className="field">
          <label htmlFor="sexo">Sexo </label>
          <Dropdown
            value={selectedSexo}
            onChange={(e) => {
              console.log(e.value.valor);
              setMascota({ ...mascota, sexo: Number(e.value.valor) });
              console.log(e.value);

              setSelectedSexo(e.value);
            }}
            // onChange={(e) =>
            //   setMascota({ ...mascota, sexo: Number(e.target.value) })
            // }
            options={[
              { sexo: "Macho", valor: "1" },
              { sexo: "Hembra", valor: "0" },
            ]}
            optionLabel="sexo"
            placeholder="Selecciona el sexo de la mascota"
            className="w-full md:w-14rem"
          />
        </div>

        <div className="field">
          <label htmlFor="id_cliente">Cliente</label>
          <div className="p-inputgroup">
            <InputText id="id_cliente" value={mascota.id_cliente} disabled />
            <Button
              onClick={() => setClienteModal(true)}
              icon=<Search />
              className="p-button-warning"
            />
          </div>
        </div>
        <br />
        <div className="field">
          <Button label="Guardar" icon="pi pi-check" onClick={saveMascota} />
        </div>
      </Dialog>

      <Dialog
        visible={categoriaModal}
        header="Seleccionar Categoría"
        style={{ width: "50vw" }}
        onHide={() => {
          if (!categoriaModal) return;
          setCategoriaModal(false);
        }}
      >
        <DataTable
          value={categorias}
          selectionMode="single"
          onRowSelect={onRowSelectCategoria}
          dataKey="id_categoria_animal"
        >
          <Column field="id_categoria_mascota" header="ID" />
          <Column field="descripcion" header="Descripción" />
        </DataTable>
      </Dialog>
      {/* modal de clientes */}
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
        visible={deleteMascotaDialog}
        header="Confirmar Eliminación"
        modal
        onHide={() => setDeleteMascotaDialog(false)}
      >
        <p>
          ¿Deseas eliminar la mascota <strong>{mascota.nombre}</strong>?
        </p>
        <Button
          label="Sí"
          icon="pi pi-check"
          onClick={deleteMascotaConfirmado}
        />
        <Button
          label="No"
          icon="pi pi-times"
          onClick={() => setDeleteMascotaDialog(false)}
        />
      </Dialog>
    </>
  );
}
