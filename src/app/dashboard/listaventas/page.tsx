"use client";
import "primereact/resources/themes/lara-light-indigo/theme.css";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import { getViewAllVenta } from "@/app/_api/ventas/getViewAllVentas";
import TablaAllVentas from "./components/tableAllVentas";

export default function ListaVentas() {
  const queryClient = useQueryClient();

  const { data: ventas = [], isPending } = useQuery({
    queryKey: ["getAllVentas"],
    queryFn: getViewAllVenta,
  });

  return (
    <div>
      <TablaAllVentas ventas={ventas} isPending={isPending} />
    </div>
  );
}
