"use client";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import { useQuery } from "@tanstack/react-query";
import { getAllProductos } from "@/app/_api/productos/getAllProductos";
import ListadoProductos from "./_components/listadoProductos";
import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { formatToLocalSqlDatetime } from "@/app/utils/utils";
import { Search } from "lucide-react";

import ListadoDetalles from "./_components/listadoDetalle";

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
        <div className="grid grid-cols-[50%_50%] grid-rows-[90px_100px] ">
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
          <div className="  col-start-2 row-start-1 h-31 rounded shadow ">
            {/* Header con título */}

            {/* Contenido de datos */}

            <div className="flex p-2 h-[100%] flex-wrap ">
              <div className="flex w-[100%]">
                <span className="text-sm opacity-80 mt-1">ID COMPRA:</span>
                <InputText
                  type="text"
                  disabled
                  className="p-inputtext-sm"
                  style={{ width: "200px", height: "10px", marginLeft: "10px" }}
                ></InputText>
              </div>
              <div className="flex  w-[100%]">
                <span className="text-sm opacity-80">Fecha:</span>
                <span className="text-sm font-medium ml-2">
                  {formatToLocalSqlDatetime(new Date())}
                </span>
              </div>
              <div className="flex  w-[100%]">
                <span className="text-sm opacity-80">Proveedor:</span>
                <div className="p-inputgroup flex-1">
                  <InputText
                    id="id_proveedor"
                    value={""}
                    disabled
                    placeholder="Busca el proveedor"
                    style={{
                      width: "200px",
                      height: "10px",
                      marginLeft: "10px",
                    }}
                  />
                  <Button
                    style={{ width: "50px", height: "10px" }}
                    onClick={() => ""}
                    icon=<Search />
                    className="p-button-warning"
                  />
                </div>
                {/* Input para Proveedor*/}
              </div>
            </div>
          </div>

          <div className=" row-span-2 col-start-2 row-start-2 h-[590px] min-h-[550px] mt-10 shadow">
            <ListadoDetalles />
            <div className="flex w-[100] h-[30%] flex-wrap bg-blue-300">dd</div>
          </div>
        </div>
      </div>
    </div>
  );
}
