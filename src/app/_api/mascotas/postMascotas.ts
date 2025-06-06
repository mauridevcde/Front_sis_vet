import { Mascota } from "@/app/interfaces/mascotas.interface";
import axios from "../axios";

export const postMascota = async (data: Mascota) => {
  return await axios.post("api/Mascotas", {
    nombre: data.nombre,
    id_categoria_animal: data.id_categoria_animal,
    raza: data.raza,
    sexo: data.sexo,
    estado: data.estado,
    id_cliente: data.id_cliente,
  });
};
