import { create } from "zustand";

type VentaState = {
  openModalDetalles: boolean;
  idVenta: number;
  setOpenModalDetalles: (key: boolean) => void;
  setIdVenta: (id: number) => void;
};

export const useDetalleVentaStore = create<VentaState>((set) => ({
  idVenta: 0,
  openModalDetalles: false,
  setOpenModalDetalles: (key) => {
    set({ openModalDetalles: key });
  },
  setIdVenta: (id: number) => {
    set({
      idVenta: id,
    });
  },
}));
