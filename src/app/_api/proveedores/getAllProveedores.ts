import { Proveedor } from "@/app/interfaces/proveedores.interface";
import axios from "../axios";

export const getAllProveedores = async (): Promise<Proveedor[]> => {
  try {
    const response = await axios.get("api/proveedores");

    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error al obtener los Proveedores:", error);
    return [];
  }
};
