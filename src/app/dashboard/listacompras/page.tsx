"use client";
import "primereact/resources/themes/lara-light-indigo/theme.css";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getViewAllCompras } from "@/app/_api/compras/getViewAllCompras";
import TablaAllCompras from "./components/tablaAllCompras";
import { getDetalleByIdCompra } from "@/app/_api/compras/getDetalleByIdCompra";

export default function ListaCompras() {
  const queryClient = useQueryClient();

  const { data: compras = [], isPending } = useQuery({
    queryKey: ["getAllViewCompras"],
    queryFn: getViewAllCompras,
  });

  return (
    <div>
      <TablaAllCompras compras={compras} isPending={isPending} />
    </div>
  );
}
