import axios from "../axios";

interface DetalleVentaById {
  id_detalle_venta: number;
  id_venta: number;
  nombre: string;
  nombre_apellido: string;
  precio_unitario: number;
  cantidad: number;
  subtotal: number;
  iva: number;
}

export const getDetalleByIdVenta = async (
  id: number
): Promise<DetalleVentaById[]> => {
  try {
    const response = await axios.get(`api/detallesVentas/${id}`);

    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error al obtener los detalles de esa venta:", error);
    return [];
  }
};
