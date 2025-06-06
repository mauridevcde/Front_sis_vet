import { CategoriaMascota } from "@/app/interfaces/categMascotas";
import axios from "../axios";

export const deleteCategoria = async (data: CategoriaMascota) => {
  return await axios.put(`api/DeleteCategMascotas/${data.id_categoria_mascota}`, {
    estado: 0,
  });
};
