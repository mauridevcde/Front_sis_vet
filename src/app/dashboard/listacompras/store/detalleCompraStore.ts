import { create } from "zustand";

type CompraState = {
  openModalDetalles: boolean;
  idCompra: number;
  setOpenModalDetalles: (key: boolean) => void;
  setIdCompra: (id: number) => void;
};

export const useDetalleCompraStore = create<CompraState>((set) => ({
  idCompra: 0,
  openModalDetalles: false,
  setOpenModalDetalles: (key) => {
    set({ openModalDetalles: key });
  },
  setIdCompra: (id: number) => {
    set({
      idCompra: id,
    });
  },
}));
