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
import { useCompraStore } from "./store/compraStore";
import ModalProveedorCompra from "./_components/modalProveedor";
import ResultadoDetalles from "./_components/resultadoDetalles";
import { InputMask } from "primereact/InputMask";

export default function Compras() {
  const [filtro, setFiltro] = useState("");
  //TODO: useCompraStore maneja el estado global de los componentes de compra.
  const openModal = useCompraStore((state) => state.modalProveedor);
  const proveedor = useCompraStore((state) => state.proveedor);
  const nroFacturaState = useCompraStore((state) => state.nroFactura);
  const setNroFactura = useCompraStore((state) => state.addNroFactura);

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
          {/* fin imput filtro */}
          {/*Inicio de Listado de productos */}
          <div className=" row-span-2 row-start-2 h-full overflow-y-auto place-items-center ">
            {isPending ? (
              "Cargando Productos..."
            ) : (
              <>
                {/* Muestra cuantos productos hay */}
                <div className="text-sm text-gray-600">
                  Mostrando {productosFiltrados.length} de {productos.length}{" "}
                  productos
                </div>
                {/* Recorre el producto filtrado, inicialmente muestra todos los productos */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1 p-1">
                  {productosFiltrados.map((producto) => (
                    //Es un componente aparte, donde maneja su propio estado global, lo unico que requiere es el producto filtrado.
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
          <div className="  col-start-2 row-start-1 h-28 rounded shadow ">
            <div className="flex p-2 h-[100%] flex-wrap ">
              <div className="flex  w-[100%]">
                <span className="text-sm opacity-80">Fecha:</span>
                <span className="text-sm font-medium ml-2">
                  {formatToLocalSqlDatetime(new Date())}
                </span>
              </div>
              <div className="flex  w-[100%]">
                <span className="text-sm opacity-80">Nro. Factura:</span>
                <div className="p-inputgroup flex-1">
                  {/* Input para Proveedor*/}
                  <InputMask
                    mask="001-9999999-9"
                    value={nroFacturaState.trim()}
                    placeholder=" N° Factura del proveedor."
                    onChange={(e) => {
                      setNroFactura(e.target.value);
                    }}
                    style={{
                      width: "40px",
                      height: "10px",
                      marginLeft: "10px",
                    }}
                  />
                </div>
              </div>
              <div className="flex  w-[100%]">
                <span className="text-sm opacity-80">Proveedor:</span>
                <div className="p-inputgroup flex-1">
                  {/* Input para Proveedor*/}
                  <InputText
                    id={proveedor?.id_proveedor?.toString()}
                    value={proveedor?.razon_social}
                    disabled
                    placeholder="Busca el proveedor"
                    style={{
                      width: "200px",
                      height: "10px",
                      marginLeft: "10px",
                    }}
                  />
                  {/* Boton de abrir modal */}
                  <Button
                    style={{ width: "50px", height: "10px" }}
                    onClick={() => {
                      openModal(true);
                    }}
                    icon=<Search />
                    className="p-button-warning"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className=" row-span-2 col-start-2 row-start-2 h-[500px] min-h-[500px] mt-10 shadow">
            {/* inicio de componente lista de detalles_compra, es decir la tabla.*/}
            <ListadoDetalles />

            {/* inicio de componente de botonera y resultado de valores de la lista */}
            <div className="flex w-[100] h-[30%] flex-wrap">
              <ResultadoDetalles />
            </div>
          </div>
          <ModalProveedorCompra />
        </div>
      </div>
    </div>
  );
}
