import { Vacuna } from "@/app/interfaces/vacunas.interface";
import axios from "../axios";

export const getAllVacunas = async (): Promise<Vacuna[]> => {
  try {
    const response = await axios.get("api/vacunas");

    // Asegura que data sea un array antes de retornarlo
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error al obtener las vacunas:", error);
    return [];
  }
};
