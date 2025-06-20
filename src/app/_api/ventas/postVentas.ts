import { VentaCompleta } from "@/app/interfaces/venta/ventaCompleta.interface";
import axios from "../axios";

export const postVentas = async (data: VentaCompleta) => {
  return await axios.post("api/ventaCompleta", {
    ...data,
  });
};
