"use client";

import { InputText } from "primereact/inputtext";
import { useProductStore } from "../store/storeProducts";

export default function FilterProducts() {
  const { filterByName } = useProductStore();
  return (
    <div className="grid h-12 ">
      <InputText
        placeholder="Buscar Producto..."
        onChange={(e) => filterByName(e.target.value)}
      ></InputText>
    </div>
  );
}
