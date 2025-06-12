"use client";
import React, { useState } from "react";
import "primereact/resources/themes/lara-light-indigo/theme.css";

import { Tag } from "primereact/tag";
import { Card } from "primereact/card";
import { Minus, Plus } from "lucide-react";

export default function Listadoproductos({ producto }: producto) {
  const [quantity, setQuantity] = useState(0);

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 0) {
      setQuantity(quantity - 1);
    }
  };

  const getStockSeverity = () => {
    if (producto.stock === 0) return "danger";
    if (producto.stock <= 5) return "warning";
    return "success";
  };

  const header = (
    <div className="relative grid">
      <img
        src={producto.imagen || ""}
        alt={producto.nombre}
        className=" h-20 object-cover transition-transform duration-300 "
      />
      <div className="absolute top-1 right-1 grid">
        <Tag
          value={producto.stock > 0 ? `${producto.stock}` : "0"}
          severity={getStockSeverity()}
          className="!text-xs !px-1 !py-0.5"
        />
      </div>
    </div>
  );

  const footer = (
    <div className="grid gap-1 pt-0">
      <div className="grid grid-cols-1">
        <span className="text-sm font-bold text-black-600 justify-self-center mx-0 p-0">
          {producto.precio_compra} Gs.
        </span>
      </div>

      <div className="grid grid-cols-[auto_1fr] gap-2 items-center">
        <div className="grid grid-cols-3 bg-gray-50 rounded border border-gray-200 overflow-hidden">
          {/* Botón de disminuir (-) */}
          <button
            onClick={decreaseQuantity}
            disabled={quantity <= 0}
            className="!w-6 !h-6 !min-w-[2rem] !min-h-[2rem] !p-0 !bg-transparent !border-0 !text-gray-600 hover:!bg-gray-100 disabled:!text-gray-300 !rounded-none cursor-pointer flex items-center justify-center"
          >
            <i className="pi pi-minus" style={{ fontSize: "13px" }}></i>
          </button>

          {/* Input manual - Versión perfectamente integrada */}
          <input
            style={{fontSize: '10px', padding: '0px'}}
            type="number"
            min="1"
            max={5000}
            value={quantity}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "") {
                setQuantity(1);
              } else {
                setQuantity(parseInt(value));
              }
            }}
            onBlur={() => {
              if (quantity < 1) setQuantity(1);
            }}
            className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full px-2 py-1 bg-white border-x border-gray-200 text-sm font-semibold text-gray-800 text-center focus:outline-none"
          />

          {/* Botón de aumentar (+) */}
          <button
            onClick={increaseQuantity}
            className="!w-8 !h-8 !min-w-[2rem] !min-h-[2rem] !p-0 !bg-transparent !border-0 !text-gray-600 hover:!bg-gray-100 disabled:!text-gray-300 !rounded-none cursor-pointer flex items-center justify-center"
          >
            <i className="pi pi-plus" style={{ fontSize: "13px" }}></i>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-xs mx-auto grid">
      <Card
        header={header}
        footer={footer}
        className="p-0 !rounded-lg !shadow-md hover:!shadow-lg !transition-shadow !duration-300 !border-0 !overflow-hidden !bg-white"
      >
        {/* Ajusté el padding aquí */}
        <h3 className="font-semibold text-xs text-gray-800 leading-tight overflow-hidden m-0">
          {/* m-0 para quitar margen */}
          <span className="block overflow-hidden text-ellipsis whitespace-wrap">
            {producto.nombre}
          </span>
        </h3>
      </Card>
    </div>
  );
}
