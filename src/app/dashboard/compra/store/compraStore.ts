import { create } from "zustand";
import { Producto } from "../../../interfaces/productos.interface";
import { Proveedor } from "../../../interfaces/proveedores.interface";
import { Compra } from "../../../interfaces/compra.interface";
import { DetalleCompra } from "../../../interfaces/detalle_compra.interface";

type CompraState = {
  productos: Producto[];
  proveedor: Proveedor | null;
  compra: Compra;
  detalle_compra: DetalleCompra[];

  addProducto: (producto: Producto) => void;
  removeProducto: (id: string) => void;
  decreaseProducto: (id: number) => void;
  addDetalle_compra: (detalle_compra: DetalleCompra) => void;
  updateCantidad: (id_producto: number, nuevaCantidad: number) => void;

  clearCompra: () => void;
  calcularTotales: () => void;
  //
};

export const useCompraStore = create<CompraState>((set) => ({
  productos: [],
  proveedor: null,
  compra: {} as Compra,
  detalle_compra: [],

  //ejecucion de agregar productos al store.
  addProducto: (producto: Producto) =>
    set((state) => {
      //verifica si existe el producto.
      const existe = state.productos.find(
        (p: Producto) => p.id_producto === producto.id_producto
      );
      //caso que varie la cantidad lo suma
      const productos = existe
        ? state.productos.map((p: Producto) =>
            p.id_producto === producto.id_producto
              ? { ...p, cantidad: (p.cantidad ?? 0) + 1 }
              : p
          )
        : [...state.productos, { ...producto, cantidad: 1 }];

      return { productos };
    }),

  // Disminuye la cantidad o elimina si llega a 0
  decreaseProducto: (id_producto: number) =>
    set((state) => {
      const producto = state.productos.find(
        (p) => p.id_producto === id_producto
      );
      if (!producto) return {};

      const nuevaCantidad = (producto.cantidad ?? 1) - 1;

      if (nuevaCantidad <= 0) {
        return {
          productos: state.productos.filter(
            (p) => p.id_producto !== id_producto
          ),
        };
      }

      return {
        productos: state.productos.map((p) =>
          p.id_producto === id_producto ? { ...p, cantidad: nuevaCantidad } : p
        ),
      };
    }),

  // Actualiza la cantidad desde un input
  updateCantidad: (id_producto, nuevaCantidad) =>
    set((state) => {
      // Validación: no permitir valores negativos o cero
      const cantidadSegura = Math.max(1, nuevaCantidad);

      return {
        productos: state.productos.map((p) =>
          p.id_producto === id_producto ? { ...p, cantidad: cantidadSegura } : p
        ),
      };
    }),
  //elimina el producto
  removeProducto: (id: string) =>
    set((state) => ({
      productos: state.productos.filter((p) => p.id_producto !== Number(id)),
    })),

  addDetalle_compra: (detalle_compra: DetalleCompra) =>
    set((state) => ({
      detalle_compra: [...state.detalle_compra, detalle_compra],
    })),

  clearCompra: () =>
    set(() => ({
      productos: [],
      proveedor: null,
      compra: {} as Compra,
      detalle_compra: [],
    })),

  calcularTotales: () => {
    // Implementar lógica de cálculo de totales aquí si es necesario
  },
}));
