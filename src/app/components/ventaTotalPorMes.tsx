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
    <div className="bg-white p-4 rounded-xl shadow-md w-full max-w-sm">
      <div className="flex justify-between items-center text-xs text-gray-400">
        <span>Month to date</span>
        <input
          type="month"
          value={mes}
          onChange={(e) => setMes(e.target.value)}
          className="border px-1 py-[2px] text-xs rounded"
        />
      </div>
      <div className="text-sm font-semibold text-gray-700 mt-1">Revenue</div>
      <div className="text-3xl font-bold text-gray-900 my-1">
        {isLoading
          ? "Cargando..."
          : (Array.isArray(data) && data.length > 0
              ? (data[0].total ?? 0).toLocaleString("es-PY", {
                  style: "currency",
                  currency: "PYG",
                })
              : "₲0")
            }
      </div>

      <div className="h-16 -mx-2">
        <Chart type="line" data={chartData} options={options} />
      </div>

      <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 bg-purple-500 rounded-full" /> Stripe
        </span>
        <span className="text-green-600 font-medium">▲ +6.1%</span>
      </div>
    </div>
  );
};
