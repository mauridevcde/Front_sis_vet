import { RegistroClinico } from "@/app/interfaces/registroClinicos.interfaces";
import axios from "../axios";

export const postRegistroClinico = async (data: RegistroClinico) => {
  return await axios.post("api/registrosClinicos", {
    Descripcion: data.Descripcion,
    fecha: data.fecha,
    id_cliente: data.id_cliente,
    estado: 1,
  });
};
