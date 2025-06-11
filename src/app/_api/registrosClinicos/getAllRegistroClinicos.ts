import { RegistroClinico } from "@/app/interfaces/registroClinicos.interfaces";
import axios from "../axios";

export const getAllRegistrosClinicos = async (): Promise<RegistroClinico[]> => {
  try {
    const response = await axios.get("api/registrosClinicos");

    // Asegura que data sea un array antes de retornarlo
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error al obtener los Registros Clinicos:", error);
    return [];
  }
};
