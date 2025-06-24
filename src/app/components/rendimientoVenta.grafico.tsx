// src/components/ChartVentasDiarias.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { Chart } from "primereact/chart";
import "primereact/resources/themes/lara-light-indigo/theme.css";

import { getVentasPorDia } from "../_api/ventas/getVentaDiariaMensual";

export const ChartVentasDiarias = () => {
  const mesActual = new Date().toISOString().slice(0, 7);

  const { data, isLoading } = useQuery<any[]>({
    queryKey: ["ventas-dia", mesActual],
    queryFn: () => getVentasPorDia(mesActual),
  });

  const chartData = {
    labels: data?.map((d) => d.fecha.slice(8, 10)),
    datasets: [
      {
        label: `Ventas diarias (${mesActual})`,
        data: data?.map((d) => d.total),
        borderColor: "#42A5F5",
        backgroundColor: "#42A5F5",
        fill: false,
        tension: 0.3,
        barPercentage: 0.5,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: `Total vendido por día - ${mesActual}`,
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (value: number) => value.toLocaleString("es-PY"),
        },
      },
    },
  };

  return (
    <div className="p-4 ">
      {isLoading ? (
        <p className="text-center text-gray-500">Cargando ventas diarias...</p>
      ) : (
        <Chart
          type="line"
          data={chartData}
          options={chartOptions}
          className=" w-full h-60"
        />
      )}
    </div>
  );
};
