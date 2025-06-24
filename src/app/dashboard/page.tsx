"use client";
import React from "react";
import { ChartVentasDiarias } from "../components/rendimientoVenta.grafico";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import { ChartAnualVentas } from "../components/chartVentasAnuales";
import { VentaTotalPorMesAnual } from "../components/ventaTotalPorMes";

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* --- Fila Superior: 3 Cajas Pequeñas --- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        {/* Caja 1: ACTIONS */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <VentaTotalPorMesAnual />
        </div>

        {/* Caja 2: PERFORMANCE */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-700">PERFORMANCE</h2>
          {/* Tu contenido aquí (ej: "12,0") */}
        </div>

        {/* Caja 3: INTERACTIONS */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-700">INTERACTIONS</h2>
          {/* Tu contenido aquí (ej: "0,03") */}
        </div>
      </div>

      {/* --- Fila Inferior: 2 Cajas Grandes --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Caja 4: YEAR ANALYSIS + 2019 (apiladas verticalmente) */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <ChartAnualVentas />
            {/* Lista de meses (ej: "COAL", "JAN", "FEV", etc.) */}
          </div>
        </div>

        {/* Caja 5: INSTRUCTIONS (ocupa el resto del ancho) */}
        <div className="bg-white rounded-lg shadow-md p-6 ">
          <ChartVentasDiarias />
        </div>
      </div>
    </div>
  );
}
