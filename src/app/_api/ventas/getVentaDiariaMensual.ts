import axios from "../axios";

export const getVentasPorDia = async (mes: string): Promise<any[]> => {
  try {
    const response = await axios.get(
      `/api/reportes/detalleVentaPorDiaDelMes?mes=${mes}`
    );

    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error(`Error al obtener la venta por dia, del mes: ${mes}`, error);
    return [];
  }
};
