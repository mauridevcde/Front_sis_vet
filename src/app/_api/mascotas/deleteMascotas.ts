import { Mascota } from "@/app/interfaces/mascotas.interface";
import axios from "../axios";

export const deleteMascota = async (data: Mascota) => {
  return await axios.put(`api/deleteMascotas/${data.id_mascota}`, {
    estado: 0,
  });
};
