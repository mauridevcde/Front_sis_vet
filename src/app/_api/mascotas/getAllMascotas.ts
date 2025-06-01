
import { Mascota } from "@/app/interfaces/mascotas.interface";
import axios from "../axios";
 

export const getAllMascotas = async (): Promise<Mascota[]> => {
  try {
    const response = await axios.get("api/mascotas");

    // Asegura que data sea un array antes de retornarlo
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error al obtener las mascotas:", error);
    return [];
  }
};