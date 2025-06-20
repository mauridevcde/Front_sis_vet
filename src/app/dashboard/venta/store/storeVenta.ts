import { create } from "zustand";
import { Producto } from "../../../interfaces/productos.interface";
import { Cliente } from "@/app/interfaces/cliente.interface";

type ventaState = {
  productos: Producto[];
  iva10: number;
  subTotal: number;
  Total: number;
  cliente: Cliente | null;
  openModalClientes: boolean;

  addProducto: (producto: Producto) => void;
  addCliente: (cliente: Cliente) => void;
  removeProducto: (id: number) => void;
  decreaseProducto: (id: number) => void;
  updateCantidad: (id_producto: number, nuevaCantidad: number) => void;
  clearVenta: () => void;
  calcularTotales: () => void;
  modalClientes: (key: boolean) => void;
};

export const useVentaStore = create<ventaState>((set, get) => ({
  productos: [],
  iva10: 0,
  subTotal: 0,
  Total: 0,
  cliente: null,
  openModalClientes: false,

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
  addCliente: (cliente) => set({ cliente }),
  removeProducto: (id) => {
    const nuevos = get().productos.filter((p) => p.id_producto !== id);
    set({ productos: nuevos });
    get().calcularTotales();
  },
  decreaseProducto: (id) => {
    const productos = get()
      .productos.map((p) => {
        if (p.id_producto === id && p.cantidad > 1) {
          return { ...p, cantidad: p.cantidad - 1 };
        }
        return p;
      })
      .filter((p) => p.cantidad > 0);

    set({ productos });
    get().calcularTotales();
  },
  updateCantidad: (id_producto, nuevaCantidad) => {
    const productos = get().productos.map((p) => {
      if (p.id_producto === id_producto) {
        return { ...p, cantidad: nuevaCantidad };
      }
      return p;
    });

    set({ productos });
    get().calcularTotales();
  },
  clearVenta: () =>
    set({
      productos: [],
      cliente: null,
      iva10: 0,
      subTotal: 0,
      Total: 0,
    }),
  calcularTotales: () => {
    const productos = get().productos;
    const subTotal = productos.reduce(
      (sum, p) => sum + p.precio_venta * p.cantidad,
      0
    );
    const iva10 = subTotal / 11;
    const Total = subTotal;

    set({ subTotal, iva10, Total });
  },

  modalClientes: (key) => set({ openModalClientes: key }),
}));
