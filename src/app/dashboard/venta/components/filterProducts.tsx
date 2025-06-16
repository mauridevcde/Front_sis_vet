"use client";

import { InputText } from "primereact/inputtext";

export default function FilterProducts() {
  return (
    <div className="grid h-12 ">
      <InputText
          placeholder="Buscar Producto..."
      ></InputText>
    </div>
  );
}
