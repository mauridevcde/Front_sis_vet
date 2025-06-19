"use client";
import "primereact/resources/themes/lara-light-indigo/theme.css";


export default function ListPricesProductSelected() {
  return (
    <>
      <div className="flex h-13 items-center justify-between rounded p-2 object-center shadow-md">
        <div className="flex w-[15%] h-10 ">
          <input
            type="number"
            className="h-10 w-[100%] border rounded"
            placeholder="0"
          />
        </div>
        <div className="flex w-[60%] h-10">
          <h1 className="font-semibold text-xs leading-tight overflow-hidden p-1 text-black ">
            PURINA DOG CHOW PERRO SABOR CARNE Y POLLO 1.5 KG
          </h1>
        </div>
        <div className="flex w-[25%] h-10">
          <span className="text-xs font-bold self-center ml-3 text-black  ">
            58.000 Gs.
          </span>
        </div>
      </div>
    </>
  );
}
