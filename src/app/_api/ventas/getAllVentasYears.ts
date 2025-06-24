import axios from "../axios";

interface viewVentas {}

export const getViewAllVenta = async (): Promise<viewVentas[]> => {
  try {
    const response = await axios.get("api/reportes/ventas/mensuales");

    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error al obtener las ventas anuales:", error);
    return [];
  }
};
