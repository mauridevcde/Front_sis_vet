import { Veterinario } from "@/app/interfaces/veterinarios.interface";
import axios from "../axios";

export const postVeterinario = async (data:  Veterinario) => {
  return await axios.post("api/veterinarios", {
    nombre_apellido: data.nombre_apellido,
    matricula: data.matricula,
    estado: 1,
  });
};
