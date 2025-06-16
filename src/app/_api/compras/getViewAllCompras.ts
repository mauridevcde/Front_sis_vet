
import axios from "../axios";

interface viewCompras {

}

export const getViewAllCompras = async (): Promise<viewCompras[]> => {
  try {
    const response = await axios.get("api/consultaCompraJoin");

    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error al obtener la vista de compras:", error);
    return [];
  }
};
