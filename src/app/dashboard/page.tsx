"use client";

import React from "react";
import CardDasboard from "../components/cardDasboard";

export default function Page() {
  return (
    <>
      <div className="@container">
        <div className="grid @xl:grid-cols-4 grid-rows-2 gap-4   @sm:grid-cols-1 grid-rows-1">
          <CardDasboard nameCard="Mascotas" dataCard="211" />
          <CardDasboard nameCard="Clientes" dataCard="211" />
          <CardDasboard nameCard="Proveedores" dataCard="32" />
          <CardDasboard nameCard="Ventas" dataCard="1000" />
        </div>
      </div>
    </>
  );
}
