import { Vacuna } from "@/app/interfaces/vacunas.interface";
import axios from "../axios";

export const putVacuna = async (data: Vacuna) => {
  return await axios.put(`api/editarVacunas/${data.id_vacuna}`, {
    id_vacuna: data.id_vacuna,
    id_cliente: data.id_cliente,
    nombre_vacuna: data.nombre_vacuna,
    fecha_aplicacion: data.fecha_aplicacion,
    proxima_dosis: data.proxima_dosis,
    id_veterinario: data.id_veterinario,
    estado: 1,
  });
};
