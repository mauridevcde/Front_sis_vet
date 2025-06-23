"use client";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import { Toast } from "primereact/toast";
import { useRef, useState } from "react";
import { useDetalleVentaStore } from "../store/detalleVentaStore";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { EyeIcon } from "lucide-react";
import ModalDetalleVenta from "./modalDetalleVenta";

export default function TablaAllVentas({ ventas, isPending }: any) {
  const [globalFilter, setGlobalFilter] = useState<string | null>(null);

  const toast = useRef<Toast>(null);

  const setOpenModal = useDetalleVentaStore(
    (state) => state.setOpenModalDetalles
  );
  const setIdVenta = useDetalleVentaStore((state) => state.setIdVenta);

  const header = (
    <div className="flex flex-wrap gap-1 align-items-center justify-content-between text-xs">
      <h4 className="m-0 text-xs">Gestionar Ventas</h4>
      <InputText
        type="search"
        onInput={(e) => setGlobalFilter((e.target as HTMLInputElement).value)}
        placeholder="Buscar Venta..."
        className="p-inputtext-sm text-xs"
        style={{ width: "120px" }}
      />
    </div>
  );
  const replaceFilterDate = (rowData: any) => {
    const date = new Date(rowData.fecha_venta);

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

  const verDetallesDeVenta = (id: number) => {
    setOpenModal(true);
    setIdVenta(id);
  };
  const numberConverter = (rowData) => {
    return <>{Intl.NumberFormat("es-ES").format(rowData.total)} Gs. </>;
  };

  return (
    <div>
      <ModalDetalleVenta />
      <Toast ref={toast} />
      <div className="p-2 bg-gray-100 text-center rounded shadow text-xs">
        <h1 className="text-base font-semibold text-gray-800">
          Lista de Ventas
        </h1>
        <div>
          {isPending ? (
            "Cargando Ventas..."
          ) : (
            <DataTable
              size="small"
              className="text-xs"
              value={ventas || []}
              dataKey="id_venta"
              paginator
              rows={5}
              globalFilter={globalFilter}
              sortField="id_venta"
              sortOrder={-1}
              header={header}
              style={{ fontSize: "14px" }}
            >
              <Column field="id_venta" header="Id de la Venta" sortable />
              <Column field="cliente" header="Cliente comprador." sortable />
              <Column field="usuario" header="Usuario efectuo la venta" />
              <Column
                field="total"
                body={numberConverter}
                header="Monto Total de venta"
              />

              <Column
                field="fecha_venta"
                header="Fecha de Venta"
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
                      onClick={(e) => verDetallesDeVenta(rowData.id_venta)}
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
