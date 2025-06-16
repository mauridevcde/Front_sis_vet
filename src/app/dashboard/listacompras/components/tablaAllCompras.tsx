"use client";
import "primereact/resources/themes/lara-light-indigo/theme.css";

import { EyeIcon, EyeOff, SquarePen } from "lucide-react";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { useRef, useState } from "react";
import ModalDetalleCompra from "./modalDetalleCompra";
import { useDetalleCompraStore } from "../store/detalleCompraStore";

export default function TablaAllCompras({ compras, isPending }: any) {
  const [globalFilter, setGlobalFilter] = useState<string | null>(null);

  const toast = useRef<Toast>(null);

  const setOpenModal = useDetalleCompraStore(
    (state) => state.setOpenModalDetalles
  );
  const setIdCompra = useDetalleCompraStore((state) => state.setIdCompra);

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
    const date = new Date(rowData.fecha_compra);

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

  const verDetallesDeCompra = (id: number) => {
    setOpenModal(true);
    setIdCompra(id);
  };
  const numberConverter = (rowData) =>{
    console.log(rowData);
    
    return <>{Intl.NumberFormat("es-ES").format(rowData.TotalNeto)} Gs. </>
  }

  return (
    <div>
      <ModalDetalleCompra />
      <Toast ref={toast} />
      <div className="p-2 bg-gray-100 text-center rounded shadow text-xs">
        <h1 className="text-base font-semibold text-gray-800">
          Lista de compras
        </h1>
        <div>
          {isPending ? (
            "Cargando Compras..."
          ) : (
            <DataTable
              size="small"
              className="text-xs"
              value={compras || []}
              dataKey="id_compra"
              paginator
              rows={5}
              globalFilter={globalFilter}
              sortField="id_compra"
              sortOrder={-1}
              header={header}
              style={{ fontSize: "14px" }}
            >
              <Column field="id_compra" header="Id de la compra" sortable />
              <Column field="razon_social" header="Proveedor." sortable />
              <Column
                field="nombre_apellido"
                header="Usuario efectuo la compra"
              />
              <Column field="TotalNeto" body={numberConverter} header="Monto Total de compra" />

              <Column
                field="fecha_compra"
                header="Fecha de Compra"
                body={replaceFilterDate}
              />

              <Column
                header="Acción"
                body={(rowData: any) => (
                  <>
                    <Button
                      icon={<EyeIcon size={13} />}
                      rounded
                      outlined
                      size="small"
                      className="mr-1 p-2 text-xs"
                      onClick={(e) => verDetallesDeCompra(rowData.id_compra)}
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
      </div>
    </div>
  );
}
