
import { RegistroClinico } from "@/app/interfaces/registroClinicos.interfaces";
import axios from "../axios";

export const deleteRegistroClinico = async (data: RegistroClinico) => {
  return await axios.put(`api/deleteRegistroClinico/${data.id_registro_clinico}`, {
    estado: 0,
  });
};
