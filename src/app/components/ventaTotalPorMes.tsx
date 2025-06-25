// src/components/MonthlyRevenueSelectorCard.tsx
"use client";

import { useQuery } from "@tanstack/react-query";

import { Chart } from "primereact/chart";
import { useState } from "react";
import { getTotalVentasPorMes } from "../_api/ventas/getVentaTotalPorMes";

export const VentaTotalPorMesAnual = () => {
  const currentMonth = new Date().toISOString().slice(0, 7);
  const [mes, setMes] = useState(currentMonth);

  const { data, isLoading } = useQuery<any[]>({
    queryKey: ["mes", mes],
    queryFn: () => getTotalVentasPorMes(mes),
  });

  const chartData = {
    labels: Array(15).fill(""),
    datasets: [
      {
        data: [
          6, 5.5, 6.2, 6.8, 7, 6.5, 6.9, 7.1, 6.6, 6.7, 6.9, 7.3, 7.2, 6.8, 7,
        ],
        borderColor: "#10b981",
        tension: 0.4,
        fill: true,
        backgroundColor: "rgba(16,185,129,0.15)",
        borderWidth: 2,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { x: { display: false }, y: { display: false } },
  };

  return (
    <div className="bg-white p-1  ">
      <div className="flex justify-between items-center text-xs text-gray-400">
        <span>Meses del Año</span>
        <input
          type="month"
          value={mes}
          onChange={(e) => setMes(e.target.value)}
          className="border px-1 py-[2px] text-xs rounded"
        />
      </div>
      <div className="text-sm font-semibold text-gray-700 mt-1">
        Ganancia del mes
      </div>
      <div className="text-3xl font-bold text-gray-900 my-1">
        {isLoading
          ? "Cargando..."
          : data && data.length > 0
          ? Intl.NumberFormat("es-PY", {
              style: "currency",
              currency: "PYG",
            }).format(data)
          : "₲0"}
      </div>

   

      <div className="flex items-center justify-between  text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <Chart  className={'w-full'} type="line" data={chartData} options={options} />
        </span>
       
      </div>
        <span className="text-green-600 font-medium">▲ +6.1%</span>
    </div>
  );
};
