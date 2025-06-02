import { Producto } from "@/app/interfaces/productos.interface";
import axios from "../axios";

export const getAllProductos = async (): Promise<Producto[]> => {
  try {
    const response = await axios.get("api/productos");

    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error al obtener los Productos:", error);
    return [];
  }
};
