"use client";

import CartSummary from "./components/cartSummary";
import FilterProducts from "./components/filterProducts";
import ListaProducts from "./components/listaProducts";
import ListProductsSelected from "./components/listProductsSelected";

export default function Venta() {
 
  return (
    <>
      <div className="grid grid-cols-5 auto-rows-min gap-2 w-full h-full ">
        {/* Fila 1 */}
        <div className="col-span-3 bg-gray-100 rounded-sm shadow h-[50px]">
          <FilterProducts />
        </div>

        {/* Columna derecha (ocupará rows 1-3) */}
        <div className="col-span-2 row-span-3 col-start-4 shadow-lg rounded h-[400px]">
          <ListProductsSelected />
        </div>

        {/* Fila 2-5 (contenido principal) - Se ajusta al contenido */}
        <div className="col-span-3 row-span-4 row-start-2 shadow-2xl overflow-y-auto h-[580px]">
          <ListaProducts />
        </div>

        {/* Fila 4-5 (esquina inferior derecha) */}
        <div className="col-span-2 row-span-2 col-start-4 row-start-4 h-[200px]">
          <CartSummary />
        </div>
      </div>
    </>
  );
}
