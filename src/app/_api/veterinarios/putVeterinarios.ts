import { Veterinario } from "@/app/interfaces/veterinarios.interface";
import axios from "../axios";

export const putVeterinario = async (data: Veterinario) => {
  return await axios.put(`api/editarVeterinarios/${data.id_veterinario}`, {
    nombre_apellido: data.nombre_apellido,
    matricula: data.matricula,
    estado: 1,
  });
};
