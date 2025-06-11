import { RegistroClinico } from "@/app/interfaces/registroClinicos.interfaces";
import axios from "../axios";

export const putRegistroClinico = async (data: RegistroClinico) => {
  return await axios.put(
    `api/editarRegistroClinico/${data.id_registro_clinico}`,
    {
      Descripcion: data.Descripcion,
      fecha: data.fecha,
      id_cliente: data.id_cliente,
      estado: 1,
    }
  );
};
