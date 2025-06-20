import { Trash } from "lucide-react";
import React from "react";
import { useVentaStore } from "../store/storeVenta";

export default function CartSummary() {
  const subTotal = useVentaStore((state) => state.subTotal);
  const iva10 = useVentaStore((state) => state.iva10);
  const total = useVentaStore((state) => state.Total);

  console.log(subTotal);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-3 w-full max-w-md mx-auto">
      {/* Resumen de items */}
      <div className="border-b border-gray-200 pb-3 mb-3">
        <p className="font-medium text-gray-700">6 items</p>
        <div className="flex justify-between mt-1">
          <span className="text-gray-600">Subtotal:</span>
          <span className="font-medium">
            {Intl.NumberFormat("es-ES").format(subTotal)} Gs.
          </span>
        </div>
      </div>

      {/* Descuento */}
      <div className="border-b border-gray-200 pb-3 mb-2">
        <div className="flex justify-between items-center">
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            Iva:
          </button>
          <div className="flex items-center">
            <span className="text-black">
              {Intl.NumberFormat("es-ES").format(iva10)}
            </span>
          </div>
        </div>
      </div>

      {/* Total */}
      <div className="mb-2">
        <div className="flex justify-between font-bold text-lg">
          <span>Total:</span>
          <span>{Intl.NumberFormat("es-ES").format(total)}</span>
        </div>
      </div>

      {/* Botón de pago */}

      <div className="flex justify-between items-center">
        <button className="w-[60px] bg-gray-500 hover:bg-gray-700 cursor-pointer text-white py-3 px-4 rounded-lg font-medium transition-colors">
          <Trash />
        </button>
        <button className="w-[85%] bg-green-500 hover:bg-green-700 cursor-pointer text-white py-3 px-4 rounded-lg font-medium transition-colors">
          Vender
        </button>
      </div>
    </div>
  );
}
