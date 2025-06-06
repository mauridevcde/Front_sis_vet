import { Mascota } from "@/app/interfaces/mascotas.interface";
import axios from "../axios";

export const putMascota = async (data: Mascota) => {
  console.log('que se va a la api:' , data);
  
  return await axios.put(`api/editarMascotas/${data.id_mascota}`, {
    nombre: data.nombre,
    id_categoria_animal: data.id_categoria_animal,
    raza: data.raza,
    sexo: data.sexo,
    estado: data.estado,
    id_cliente: data.id_cliente,
  });
};
