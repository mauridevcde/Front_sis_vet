import { Producto } from '@/app/interfaces/productos.interface';
import { create } from 'zustand';



type ProductStore = {
  allProducts: Producto[];
  filteredProducts: Producto[];

  setProducts: (productos: Producto[]) => void;
  filterByName: (nombre: string) => void;
  resetFilters: () => void;
};

export const useProductStore = create<ProductStore>((set, get) => ({
  allProducts: [],
  filteredProducts: [],

  // Cargar todos los productos
  setProducts: (productos) =>
    set({
      allProducts: productos,
      filteredProducts: productos, // Por defecto se muestran todos
    }),

  // Filtrar por nombre
  filterByName: (nombre) => {
    const all = get().allProducts;
    const filtered = all.filter(p =>
      p.nombre.toLowerCase().includes(nombre.toLowerCase())
    );
    set({ filteredProducts: filtered });
  },

  // Resetear filtros
  resetFilters: () => {
    set((state) => ({
      filteredProducts: state.allProducts
    }));
  }
}));
