import axios from "../axios";

interface detalleCompraById {}

export const getDetalleByIdCompra = async (
  id: number
): Promise<detalleCompraById[]> => {
  try {
    console.log(id);
    
    const response = await axios.get(`api/getDetalleByCompraID/${id}`);

    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error al obtener la vista de compras:", error);
    return [];
  }
};
