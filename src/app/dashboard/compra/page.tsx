"use client";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import { useQuery } from "@tanstack/react-query";
import { getAllProductos } from "@/app/_api/productos/getAllProductos";
import ListadoProductos from "./_components/listadoProductos";

export default function Compras() {
  
  const { data: productos = [], isPending } = useQuery({
    queryKey: ["productos"],
    queryFn: getAllProductos,
  });

  return (
    <div className="@container ">
      <div className="grid grid-cols-[60%_40%] grid-rows-[0px_100px_450px] ">
        <div className="col-span-2 h-full  ">
         
        </div>

        <div className="bg-red-500 h-full">Datos proveedor</div>
        <div className=" row-span-2 row-start-2 h-full overflow-y-auto ">
          {isPending ? (
            "Cargando Productos..."
          ) : (
            <ListadoProductos producto={productos} />
          )}
        </div>
        <div className="bg-blue-900 h-full">Grilla de cálculos</div>
      </div>
    </div>
  );
}
