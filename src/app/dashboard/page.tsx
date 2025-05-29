"use client";

import React from "react";
import CardDasboard from "../components/cardDasboard";

export default function Page() {
  return (
    <>
      <CardDasboard nameCard="Mascotas" dataCard="211"/>
      <CardDasboard nameCard="Clientes" dataCard="211" />
      <CardDasboard nameCard="Proveedores" dataCard="32"/>
      <CardDasboard nameCard="Ventas" dataCard="1000"/>
    </>
  );
}
