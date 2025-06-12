"use client";
import React, { useState, useEffect } from "react";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import { Button } from "primereact/button";
import { DataView, DataViewLayoutOptions } from "primereact/dataview";
import { Rating } from "primereact/rating";
import { Tag } from "primereact/tag";
import { classNames } from "primereact/utils";
import { Producto } from "@/app/interfaces/productos.interface";
import { InputText } from "primereact/inputtext";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { Badge } from "primereact/badge";
import { Card } from "primereact/card";

export default function ListadoProductos({ producto }: Producto[]) {
  console.log(producto);
  const [quantity, setQuantity] = useState(1);
  const [layout, setLayout] = useState("grid");

  const getSeverity = (product) => {
    switch (product.inventoryStatus) {
      case "INSTOCK":
        return "success";

      case "LOWSTOCK":
        return "warning";

      case "OUTOFSTOCK":
        return "danger";

      default:
        return null;
    }
  };

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const gridItem = (product: Producto) => {
    return (
      <div className="w-full max-w-sm mx-auto">
        <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div className="relative">
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <Badge
              variant={
                product.stock > 10
                  ? "default"
                  : product.stock > 0
                  ? "secondary"
                  : "destructive"
              }
              className="absolute top-2 right-2"
            >
              {product.stock > 0 ? `Stock: ${product.stock}` : "Sin stock"}
            </Badge>
          </div>

          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2 line-clamp-2 min-h-[3.5rem]">
              {product.name}
            </h3>

            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl font-bold text-primary">
                ${product.price}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  className="h-8 w-8 p-0 hover:bg-muted"
                >
                  <Minus className="h-4 w-4" />
                </Button>

                <span className="px-3 py-1 min-w-[2rem] text-center font-medium">
                  {quantity}
                </span>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={increaseQuantity}
                  disabled={quantity >= product.stock}
                  className="h-8 w-8 p-0 hover:bg-muted"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <Button
                size="sm"
                disabled={product.stock === 0}
                className="flex-1 ml-2"
              >
                <ShoppingCart className="h-4 w-4 mr-1" />
                Agregar
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  const itemTemplate = (product, layout, index) => {
    if (!product) {
      return;
    }

    if (layout === "list") return listItem(product, index);
    else if (layout === "grid") return gridItem(product);
  };

  const listTemplate = (products, layout) => {
    return (
      <div className=" grid grid-cols-3 gap-1.5  ">
        {products.map((product, index) => itemTemplate(product, layout, index))}
      </div>
    );
  };

  const header = () => {
    return (
      <div className="flex justify-content-end  ">
        <InputText
          type="search"
          onInput={(e) => ""}
          placeholder="Buscar Producto"
          className="p-inputtext-sm text-xs"
          style={{ width: "300px" }}
        />
      </div>
    );
  };

  return (
    <div className="card  ">
      <DataView
        value={producto}
        listTemplate={listTemplate}
        layout={layout}
        header={header()}
      />
    </div>
  );
}
