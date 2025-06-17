"use client";

import FilterProducts from "./components/filterProducts";
import ListaProducts from "./components/listaProducts";

export default function Venta() {
  return (
    <>
      <div className="grid grid-cols-5 grid-rows-5 grid-rows-none gap-1">
        <div className="col-span-3 bg-gray-100 h-[50px] rounded-sm shadow ">
          <FilterProducts />
        </div>
        <div className="col-span-2 row-span-3 col-start-4 bg-blue-400">2</div>
        <div className="col-span-3 row-span-4 row-start-2 h-screen">
          <ListaProducts />
        </div>
        <div className="col-span-2 row-span-2 col-start-4 row-start-4 bg-green-400">
          4
        </div>
      </div>
    </>
  );
}
