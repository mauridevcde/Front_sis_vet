// services/putCliente.ts
import { Cliente } from "@/app/interfaces/cliente.interface";
import axios from "../axios";

export const putCliente = async (data: Cliente) => {
  return await axios.put(`api/editarclientes/${data.id_cliente}`, {
    nombre_apellido: data.nombre_apellido,
    ruc: data.ruc,
    ci: data.ci,
    nro_tel: data.nro_tel,
    direccion: data.direccion,
    correo: data.correo,
    estado: 1,
  });
};