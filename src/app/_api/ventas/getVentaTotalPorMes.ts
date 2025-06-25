import axios from "../axios";

export const getTotalVentasPorMes = async (mes: string): Promise<any[]> => {
  try {
    console.log(`Obteniendo venta total para el mes: ${mes}`);
    
    const response = await axios.get(
      `/api/reportes/ventas/totalVentaPorMes?mes=${mes}`
    );
    console.log(`Respuesta de la API para el mes ${mes}:`, response.data);
    
    return response && response.data ? response.data.total : [];

  } catch (error) {
    console.error(`Error al obtener la venta del mes: ${mes}`, error);
    return [];
  }
};
