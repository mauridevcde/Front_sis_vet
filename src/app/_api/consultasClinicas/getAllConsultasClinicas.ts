
import { ConsultaClinica } from "@/app/interfaces/consultasClinicas.interface";
import axios from "../axios";

export const getAllConsultas = async (): Promise<ConsultaClinica[]> => {
  try {
    const response = await axios.get("api/consultasClinicas");

    // Asegura que data sea un array antes de retornarlo
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error al obtener las consultas Clinicas:", error);
    return [];
  }
};
