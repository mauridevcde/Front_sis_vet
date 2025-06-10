import { Cirugia } from "@/app/interfaces/cirugias.interface";
import axios from "../axios";

export const postCirugia = async (data: Cirugia) => {
  return await axios.post("api/cirugias", {
    id_cliente: data.id_cliente,
    fecha_cirugia: data.fecha_cirugia,
    tipo_cirugia: data.tipo_cirugia,
    observaciones: data.observaciones,
    id_veterinario: data.id_veterinario,
    estado: 1,
  });
};
