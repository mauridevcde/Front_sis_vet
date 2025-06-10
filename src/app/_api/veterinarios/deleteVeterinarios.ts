import { Veterinario } from "@/app/interfaces/veterinarios.interface";
import axios from "../axios";

export const deleteVeterinarios = async (data: Veterinario) => {
  return await axios.put(`api/deleteVeterinarios/${data.id_veterinario}`, {
    estado: 0,
  });
};
