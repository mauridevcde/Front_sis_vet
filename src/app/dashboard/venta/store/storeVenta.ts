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

  addProducto: (producto: Producto) => boolean;
  addCliente: (cliente: Cliente) => void;
  removeProducto: (id: number) => void;
  decreaseProducto: (id: number) => void;
  updateCantidad: (id_producto: number, nuevaCantidad: number) => boolean;
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

  addProducto: (producto) => {
    const state = get();
    const existe = state.productos.find(
      (p) => p.id_producto === producto.id_producto
    );
    const nuevaCantidad = existe ? (existe.cantidad ?? 0) + 1 : 1;

    if (producto.stock < nuevaCantidad) {
      return false; // stock insuficiente
    }

    const productos = existe
      ? state.productos.map((p) =>
          p.id_producto === producto.id_producto
            ? { ...p, cantidad: nuevaCantidad }
            : p
        )
      : [...state.productos, { ...producto, cantidad: 1 }];

    set({ productos });
    state.calcularTotales();
    return true; // agregado correctamente
  },
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
    if (!nuevaCantidad || nuevaCantidad < 1) return false;

    let excedeStock = false;

    const productos = get().productos.map((p) => {
      if (p.id_producto === id_producto) {
        const stock = p.stock ?? 0;
        if (nuevaCantidad > stock) {
          excedeStock = true;
        }

        return {
          ...p,
          cantidad: Math.min(nuevaCantidad, stock),
        };
      }
      return p;
    });

    set({ productos });
    get().calcularTotales();

    return !excedeStock;
  },

  calcularTotales: () => {
    const productos = get().productos;
    const subTotal = productos.reduce((sum, p) => {
      const precio = p.precio_venta ?? 0;
      const cantidad = p.cantidad ?? 0;
      return sum + precio * cantidad;
    }, 0);

    const iva10 = subTotal / 11;
    const Total = subTotal;

    set({ subTotal, iva10, Total });
  },
  clearVenta: () =>
    set({
      productos: [],
      cliente: null,
      iva10: 0,
      subTotal: 0,
      Total: 0,
      openModalClientes: false,
    }),
  modalClientes: (key) => set({ openModalClientes: key }),
}));
