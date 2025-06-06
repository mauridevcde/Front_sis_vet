import { CategoriaMascota } from "@/app/interfaces/categMascotas.interface";
import axios from "../axios";

export const getAllCategorias = async (): Promise<CategoriaMascota[]> => {
  try {
    const response = await axios.get("api/CategMascotas");

    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error al obtener los Categoria de Mascotas:", error);
    return [];
  }
};
