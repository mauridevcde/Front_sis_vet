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
import { Producto } from "../../interfaces/productos.interface";
import { getAllProductos } from "@/app/_api/productos/getAllProductos";
import { postProducto } from "@/app/_api/productos/postProductos";
import { putProducto } from "@/app/_api/productos/putProductos";
import { deleteProducto } from "@/app/_api/productos/deleteProductos";
import { SyncLoader } from "react-spinners";
import { Search, SquarePen, Trash2 } from "lucide-react";
import { getAllProveedores } from "@/app/_api/proveedores/getAllProveedores";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import { useAuthStore } from "@/app/_store/authStore";
import { formatToLocalSqlDatetime } from "@/app/utils/utils";

interface AuthStore {
  nombre_apellido: string;
  id_usuario: number;
  id_rol: number;
}
export default function Productos() {
  const { id_usuario: IDusuarioParaPost } = useAuthStore() as AuthStore;

  const emptyProducto: Producto = {
    id_producto: 0,
    nombre: "",
    fecha_vencimiento: "",
    id_proveedor: 0,
    stock: 0,
    precio_compra: 0,
    precio_venta: 0,
    unidad_medida: "",
    imagen: "",
    estado: 1,
    TipoDeVenta: "Contado",
    iva: 0,
    id_usuario: 0,
    codigoDeBarra: "",
  };

  const [producto, setProducto] = useState<Producto>(emptyProducto);
  const [imgProd, setImgProducto] = useState("");
  const [productoDialog, setProductoDialog] = useState(false);
  const [visibleImagenProducto, setVisibleImagenProducto] = useState(false);
  const [deleteProductoDialog, setDeleteProductoDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState<string | null>(null);
  const [datetimeFechaVencimiento, setDateTimeFechaVencimiento] =
    useState(null);
  const [selectedProductos, setSelectedProductos] = useState<Producto[] | null>(
    null
  );
  const [proveedorModal, setProveedorModal] = useState(false);
  const [selectedProveedor, setSelectedProveedor] = useState(null);
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<Producto[]>>(null);

  const queryClient = useQueryClient();

  const { data: productos = [], isPending } = useQuery({
    queryKey: ["productos"],
    queryFn: getAllProductos,
  });

  const { data: proveedores = [], isPending: isPendigDataProovedor } = useQuery(
    {
      queryKey: ["proveedor"],
      queryFn: getAllProveedores,
    }
  );

  const mutationNewProducto = useMutation({
    mutationFn: postProducto,
    onSuccess: () => {
      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: "Producto creado",
        life: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["productos"] });
      setProductoDialog(false);
      setProducto(emptyProducto);
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

  const mutationUpdateProducto = useMutation({
    mutationFn: putProducto,
    onSuccess: () => {
      toast.current?.show({
        severity: "success",
        summary: "Actualizado",
        detail: "Producto actualizado",
        life: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["productos"] });
      setProductoDialog(false);
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

  const mutationDeleteProducto = useMutation({
    mutationFn: deleteProducto,
    onSuccess: () => {
      toast.current?.show({
        severity: "success",
        summary: "Eliminado",
        detail: "Producto eliminado",
        life: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["productos"] });
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

  const saveProducto = () => {
    setSubmitted(true);
    //
    console.log("Id_usuario: ", IDusuarioParaPost);
    const productoToEdit = {
      ...producto,
      id_usuario: IDusuarioParaPost,
      fecha_vencimiento: datetimeFechaVencimiento
        ? formatToLocalSqlDatetime(datetimeFechaVencimiento)
        : "",
    };

    const productoToPost = {
      ...producto,
      id_usuario: IDusuarioParaPost,
    };
    if (producto.nombre.trim()) {
      if (producto.id_producto !== 0) {
        mutationUpdateProducto.mutate(productoToEdit);
      } else {
        mutationNewProducto.mutate(productoToPost);
      }
    }
  };

  const openNew = () => {
    setProducto(emptyProducto);
    setSubmitted(false);
    setProductoDialog(true);
    setDateTimeFechaVencimiento(null);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setProductoDialog(false);
  };

  const editProducto = (prod: Producto) => {
    setProducto({ ...prod });
    setDateTimeFechaVencimiento(
      prod.fecha_vencimiento ? new Date(prod.fecha_vencimiento) : null
    );
    setProductoDialog(true);
  };

  const confirmDeleteProducto = (prod: Producto) => {
    setProducto(prod);
    setDeleteProductoDialog(true);
  };

  const deleteProductoConfirmado = () => {
    setDeleteProductoDialog(false);
    mutationDeleteProducto.mutate(producto);
  };

  const imageBodyTemplate = (rowData: any) => {
    return (
      <img
        onClick={() => {
          setImgProducto("");
          setVisibleImagenProducto(true);
          setImgProducto(rowData.imagen);
        }}
        src={`${rowData.imagen}`}
        alt={rowData.imagen}
        className="shadow-2 border-round"
        style={{ width: "50px", height: "50px", objectFit: "cover" }}
      />
    );
  };
  const onRowSelectProv = (event: any) => {
    setProducto({
      ...producto,
      id_proveedor: Number(event.data.id_proveedor),
    });
    setProveedorModal(false);
    toast.current?.show({
      severity: "info",
      summary: "Proveedor Seleccionado!",
      detail: `Nombre: ${event.data.descripcion}`,
      life: 3000,
    });
  };

  const onRowUnselectProv = (event: any) => {
    toast.current?.show({
      severity: "warn",
      summary: "Proveedor Desmarcado!",
      detail: `Nombre: ${event.data.descripcion}`,
      life: 3000,
    });
  };
  const header = (
    <div className="flex flex-wrap gap-1 align-items-center justify-content-between text-xs">
      <h4 className="m-0 text-xs">Gestionar Productos</h4>
      <InputText
        type="search"
        onInput={(e) => setGlobalFilter((e.target as HTMLInputElement).value)}
        placeholder="Buscar..."
        className="p-inputtext-sm text-xs"
        style={{ width: "120px" }}
      />
    </div>
  );

  const replaceFilterDate = (rowData: any) => {
    const date = new Date(rowData.fecha_vencimiento);

    const representative = date.toLocaleString("es-PY", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false, // Para formato de 24 horas
    });

    return (
      <div className="flex align-items-center gap-2">{representative}</div>
    );
  };

  return (
    <>
      <div>
        <Toast ref={toast} />
        <div className="p-2 bg-gray-100 text-center rounded shadow text-xs">
          <h1 className="text-base font-semibold text-gray-800">Productos</h1>
        </div>
        <div className="card mt-2">
          <Toolbar
            className="mb-2 text-xs"
            left={() => (
              <Button
                label="+ Nuevo Producto"
                severity="info"
                size="small"
                className="text-xs p-2"
                onClick={openNew}
              />
            )}
            right={() => (
              <Button
                label="Excel"
                icon="pi pi-upload"
                severity="success"
                size="small"
                className="text-xs p-2"
                onClick={() => dt.current?.exportCSV()}
              />
            )}
          />
          {isPending ? (
            <SyncLoader size={8} />
          ) : (
            <DataTable
              ref={dt}
              size="small"
              className="text-xs"
              value={productos || []}
              selection={selectedProductos}
              dataKey="id_producto"
              paginator
              rows={5}
              globalFilter={globalFilter}
              sortField="id_producto"
              sortOrder={-1}
              header={header}
              style={{ fontSize: "14px" }}
            >
              <Column field="id_producto" header="Id" sortable />
              <Column field="nombre" header="Producto" sortable />
              <Column field="precio_compra" header="Precio. Compra" />
              <Column field="precio_venta" header="Precio. Venta" />
              <Column field="imagen" body={imageBodyTemplate} header="Imagen" />

              <Column
                field="fecha_vencimiento"
                header="Vencimiento."
                body={replaceFilterDate}
              />
              <Column field="stock" header="stock." />
              <Column
                header="Acción"
                body={(rowData: Producto) => (
                  <>
                    <Button
                      icon={<SquarePen size={16} />}
                      rounded
                      outlined
                      size="small"
                      className="mr-1 p-2 text-xs"
                      onClick={() => editProducto(rowData)}
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
                      onClick={() => confirmDeleteProducto(rowData)}
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
                className="text-xs"
              />
            </DataTable>
          )}
        </div>

        {/* modal proveedor */}

        <Dialog
          header="Selecciona el Proveedor"
          visible={proveedorModal}
          style={{ width: "50vw" }}
          onHide={() => {
            if (!proveedorModal) return;
            setProveedorModal(false);
          }}
          footer={
            <>
              <Button
                className="bg-bluegray-600"
                label="Cancelar"
                icon="pi
                  pi-times"
                onClick={() => setProveedorModal(false)}
                size="small"
                rounded
                severity="danger"
              ></Button>
            </>
          }
        >
          <DataTable
            value={proveedores}
            selectionMode="single"
            selection={selectedProveedor}
            onSelectionChange={(e) => setSelectedProveedor(e.value)}
            dataKey="id_proveedor"
            onRowSelect={onRowSelectProv}
            onRowUnselect={onRowUnselectProv}
            metaKeySelection={false}
            tableStyle={{ minWidth: "50rem", fontSize: "10px" }}
          >
            <Column field="id_proveedor" header="ID"></Column>
            <Column field="razon_social" header="Razón Social"></Column>
            <Column field="ruc" header="RUC"></Column>
          </DataTable>
        </Dialog>
        {/* fin modal proveedor */}

        <Dialog
          visible={productoDialog}
          style={{ width: "22rem" }}
          header="Detalles del Producto"
          modal
          className="p-fluid text-xs"
          onHide={hideDialog}
          footer={
            <>
              <Button
                label="Cancelar"
                icon="pi pi-times"
                onClick={hideDialog}
                size="small"
                severity="danger"
                className="text-xs p-2"
              />
              <Button
                label="Guardar"
                icon="pi pi-check"
                onClick={saveProducto}
                size="small"
                severity="info"
                className="text-xs p-2"
              />
            </>
          }
        >
          <div className="field mb-2">
            <label htmlFor="nombre" className="text-xs">
              Nombre
            </label>
            <InputText
              id="nombre"
              value={producto.nombre}
              onChange={(e) =>
                setProducto({ ...producto, nombre: e.target.value })
              }
              required
              autoFocus
              className="p-inputtext-sm text-xs"
            />
          </div>
          <div className="field mb-2">
            <label htmlFor="fecha_vencimiento" className="text-xs">
              Fecha de Vencimiento
            </label>
            <Calendar
              id="fecha_vencimiento"
              value={datetimeFechaVencimiento}
              onChange={(e) => {
                setDateTimeFechaVencimiento(e.value);
                setProducto({
                  ...producto,
                  fecha_vencimiento: formatToLocalSqlDatetime(e.value),
                });
              }}
              showTime
              hourFormat="24"
            />
          </div>

          <div className="field mb-2">
            <label htmlFor="id_proveedor" className="text-xs">
              Proveedor
            </label>
            <div className="p-inputgroup flex-1">
              <InputText
                id="id_proveedor"
                value={producto.id_proveedor}
                disabled
                placeholder="Busca el proveedor"
              />
              <Button
                onClick={() => setProveedorModal(true)}
                icon=<Search />
                className="p-button-warning"
              />
            </div>
          </div>

          <div className="field mb-2">
            <label htmlFor="precio_compra" className="text-xs">
              Precio Compra
            </label>
            <InputNumber
              id="precio_compra"
              value={Number(producto.precio_compra)}
              onValueChange={(e) =>
                setProducto({
                  ...producto,
                  precio_compra: Number(e.target.value),
                })
              }
              className="p-inputtext-sm text-xs"
            />
          </div>
          <div className="field mb-2">
            <label htmlFor="precio_venta" className="text-xs">
              Precio Venta
            </label>
            <InputNumber
              id="precio_venta"
              value={Number(producto.precio_venta)}
              onValueChange={(e) =>
                setProducto({
                  ...producto,
                  precio_venta: Number(e.target.value),
                })
              }
              className="p-inputtext-sm text-xs"
            />
          </div>
          <div className="field mb-2">
            <label htmlFor="unidad_medida" className="text-xs">
              Unidad de Medida
            </label>
            <InputText
              id="unidad_medida"
              value={producto.unidad_medida}
              onChange={(e) =>
                setProducto({ ...producto, unidad_medida: e.target.value })
              }
              className="p-inputtext-sm text-xs"
            />
          </div>
          <div className="field mb-2">
            <label htmlFor="imagen" className="text-xs">
              Imagen (URL)
            </label>
            <InputText
              id="imagen"
              value={producto.imagen}
              onChange={(e) =>
                setProducto({ ...producto, imagen: e.target.value })
              }
              className="p-inputtext-sm text-xs"
            />
          </div>
          <div className="field mb-2">
            <label htmlFor="estado" className="text-xs">
              Estado
            </label>
            <InputText
              id="estado"
              value={producto.estado}
              onChange={(e) =>
                setProducto({ ...producto, estado: Number(e.target.value) })
              }
              className="p-inputtext-sm text-xs"
            />
          </div>
          <div className="field mb-2">
            <label htmlFor="TipoDeVenta" className="text-xs">
              Tipo de Venta
            </label>
            <InputText
              id="TipoDeVenta"
              value={producto.TipoDeVenta}
              onChange={(e) =>
                setProducto({ ...producto, TipoDeVenta: e.target.value })
              }
              className="p-inputtext-sm text-xs"
            />
          </div>
          <div className="field mb-2">
            <label htmlFor="iva" className="text-xs">
              IVA
            </label>
            <InputText
              id="iva"
              value={producto.iva}
              onChange={(e) =>
                setProducto({ ...producto, iva: Number(e.target.value) })
              }
              className="p-inputtext-sm text-xs"
            />
          </div>

          <div className="field mb-2">
            <label htmlFor="codigoDeBarra" className="text-xs">
              Código de Barra
            </label>
            <InputText
              id="codigoDeBarra"
              value={producto.codigoDeBarra}
              onChange={(e) =>
                setProducto({ ...producto, codigoDeBarra: e.target.value })
              }
              className="p-inputtext-sm text-xs"
            />
          </div>
        </Dialog>

        <Dialog
          visible={deleteProductoDialog}
          style={{ width: "18rem" }}
          header="Confirmar Eliminación"
          modal
          className="text-xs"
          onHide={() => setDeleteProductoDialog(false)}
          footer={
            <>
              <Button
                label="No"
                icon="pi pi-times"
                onClick={() => setDeleteProductoDialog(false)}
                size="small"
                className="text-xs p-2"
              />
              <Button
                label="Sí"
                icon="pi pi-check"
                onClick={deleteProductoConfirmado}
                size="small"
                className="text-xs p-2"
              />
            </>
          }
        >
          <p className="text-xs">
            ¿Deseas eliminar el producto <strong>{producto.nombre}</strong>?
          </p>
        </Dialog>
        {/* modal para ver imagen del producto */}
        <Dialog
          header="Imagen del producto"
          visible={visibleImagenProducto}
          style={{ width: "50vw" }}
          onHide={() => {
            if (!visibleImagenProducto) return;
            setVisibleImagenProducto(false);
          }}
        >
          <img src={imgProd} className="w-100 object-cover"></img>
        </Dialog>
      </div>
    </>
  );
}
