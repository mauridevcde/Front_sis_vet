import { Cliente } from "@/app/interfaces/cliente.interface";
import axios from "../axios";

export const postCliente = async (data: Cliente) => {
  return await axios.post("api/clientes", {
    nombre_apellido: data.nombre_apellido,
    ruc: data.ruc,
    ci: data.ci,
    nro_tel: data.nro_tel,
    direccion: data.direccion,
    correo: data.correo,
    id_mascota: data.id_mascota,
    estado: 1,
  });
};
