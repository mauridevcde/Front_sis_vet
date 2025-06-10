import { Cirugia } from "@/app/interfaces/cirugias.interface";

import axios from "../axios";

export const getAllCirugias = async (): Promise<Cirugia[]> => {
  try {
    const response = await axios.get("api/cirugias");

    // Asegura que data sea un array antes de retornarlo
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error al obtener las cirugias:", error);
    return [];
  }
};
