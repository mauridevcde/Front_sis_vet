import { CategoriaMascota } from "@/app/interfaces/categMascotas.interface";
import axios from "../axios";

export const postCategoria = async (data: CategoriaMascota) => {
  return await axios.post("api/CategMascotas", {
    descripcion: data.descripcion,
    estado: 1,
  });
};
