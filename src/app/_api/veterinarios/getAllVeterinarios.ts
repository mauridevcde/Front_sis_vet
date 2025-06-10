import { Veterinario } from "@/app/interfaces/veterinarios.interface";
import axios from "../axios";
// Asegúrate de tener el tipo

export const getAllVeterinarios = async (): Promise<Veterinario[]> => {
  try {
    const response = await axios.get("api/veterinarios");

    // Asegura que data sea un array antes de retornarlo
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error al obtener los Veterinarios:", error);
    return [];
  }
};
