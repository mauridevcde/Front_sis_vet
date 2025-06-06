// services/putCliente.ts
import { CategoriaMascota } from "@/app/interfaces/categMascotas";
import axios from "../axios";

export const putCategoria = async (data: CategoriaMascota) => {
  return await axios.put(`api/editarCategMascotas/${data.id_categoria_mascota}`, {
    descripcion: data.descripcion,
    estado: 1,
  });
};
