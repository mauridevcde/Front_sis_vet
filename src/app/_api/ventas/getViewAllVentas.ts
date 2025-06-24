
import axios from "../axios";

interface viewVentas {

}

export const getAllVentasYear = async (): Promise<viewVentas[]> => {
  try {
    const response = await axios.get("api/ventaJoin");

    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error al obtener las ventas:", error);
    return [];
  }
};
