import axios from "../axios";

export const getTotalVentasPorMes = async (mes: string): Promise<any[]> => {
  try {
    const response = await axios.get(
      `/api/reportes/ventas/totalVentaPorMes?mes=${mes}`
    );

    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error(`Error al obtener la venta del mes: ${mes}`, error);
    return [];
  }
};
