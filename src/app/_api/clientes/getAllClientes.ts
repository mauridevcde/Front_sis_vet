import { Cliente } from "@/app/interfaces/cliente.interface";
import axios from "../axios";
 // Asegúrate de tener el tipo

export const getAllClientes = async (): Promise<Cliente[]> => {
  try {
    const response = await axios.get("api/clientes");

    // Asegura que data sea un array antes de retornarlo
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error al obtener los clientes:", error);
    return [];
  }
};