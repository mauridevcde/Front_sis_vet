"use client";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import { useQuery } from "@tanstack/react-query";
import { getAllProductos } from "@/app/_api/productos/getAllProductos";
import ListadoProductos from "./_components/listadoProductos";
import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { formatToLocalSqlDatetime } from "@/app/utils/utils";

export default function Compras() {
  const [filtro, setFiltro] = useState("");

  const { data: productos = [], isPending } = useQuery({
    queryKey: ["productos"],
    queryFn: getAllProductos,
  });

  // Función para filtrar productos por nombre o ID
  const productosFiltrados = productos.filter(
    (producto) =>
      producto.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
      producto.id_producto.toString().includes(filtro)
  );

  return (
    <div className="@container ">
      {/* grilla padre */}
      <div className="grid grid-cols-1 grid-rows-1 ">
        <div className="grid grid-cols-[60%_40%] grid-rows-[90px_100px] ">
          <div className="col-span-1 h-full  ">
            <div className="flex flex-col gap-4">
              {/* Input de filtro */}
              {isPending ? (
                ""
              ) : (
                <div className="p-inputgroup w-full max-w-md">
                  <span className="p-inputgroup-addon">
                    <i className="pi pi-search"></i>
                  </span>
                  <InputText
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                    placeholder="Buscar productos..."
                    className="w-full"
                  />
                  {filtro && (
                    <Button
                      icon="pi pi-times"
                      className="p-button-text"
                      onClick={() => setFiltro("")}
                    />
                  )}
                </div>
              )}
            </div>
          </div>

          <div className=" row-span-2 row-start-2 h-full overflow-y-auto place-items-center ">
            {isPending ? (
              "Cargando Productos..."
            ) : (
              <>
                <div className="text-sm text-gray-600">
                  Mostrando {productosFiltrados.length} de {productos.length}{" "}
                  productos
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 p-2">
                  {productosFiltrados.map((producto) => (
                    <ListadoProductos
                      key={producto.id_producto}
                      producto={producto}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
          {/* seccion derecha de inputs */}
          <div className="bg-red-500  col-start-2 row-start-1  ">
            {/* Header con título */}
            <div className="flex justify-between items-center p-2 border-b border-red-600">
              {/* Contenido de datos */}
              <div className="p-3 text-white space-y-2">
                <div className="grid grid-cols-2 gap-1 items-center">
                  <span className="text-sm opacity-80">ID:</span>
                  <InputText></InputText>

                  <span className="text-sm opacity-80">Fecha:</span>
                  <span className="text-sm font-medium">
                    {formatToLocalSqlDatetime(new Date())}
                  </span>

                  <span className="text-sm opacity-80">Proveedor:</span>

                  {/* Input para Proveedor*/}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Seleccione proveedor"
                      className="w-full p-1.5 text-sm text-gray-800 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-red-300"
                    />
                    <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-500">
                      <i
                        className="pi pi-chevron-down"
                        style={{ fontSize: "12px" }}
                      ></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-900 row-span-2 col-start-2 row-start-2 h-[620px] min-h-[600px]">
            Grilla de cálculos
          </div>
        </div>
      </div>
    </div>
  );
}
