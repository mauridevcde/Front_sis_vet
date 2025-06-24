// src/components/ChartAnual.tsx
"use client";
import { useQuery } from "@tanstack/react-query";
import { Chart } from "primereact/chart";
import { getAllVentasYear } from "../_api/ventas/getViewAllVentas";

const mesesNombres = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
];

export const ChartAnualVentas = () => {
  const { data } = useQuery<any[]>({
    queryKey: ["ventasMensuales"],
    queryFn: getAllVentasYear,
  });
  if (!data) return <p>Cargando gráfico...</p>;
  console.log("Datos de ventas anuales:", data);
  
  const totals = Array(12).fill(0);
  data.forEach((m) => (totals[m.mes - 1] = m.total));

  const chartData = {
    labels: mesesNombres,
    datasets: [
      {
        label: `Ventas anuales: ${new Date().getFullYear()}`,
        data: totals,
        backgroundColor: totals.map((_, i) => (i % 2 ? "#3b82f6" : "#10b981")),
        borderColor: "#000",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: { legend: { position: "top" } },
    scales: {
      y: { ticks: { callback: (v: number) => v.toLocaleString("es-PY") } },
    },
  };

  return (
    <Chart
      type="bar"
      data={chartData}
      options={options}
      className=" p-4 h-[300px]"
    />
  );
};
