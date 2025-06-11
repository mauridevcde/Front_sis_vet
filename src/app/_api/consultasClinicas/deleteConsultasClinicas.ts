import { ConsultaClinica } from "@/app/interfaces/consultasClinicas.interface";
import axios from "../axios";

export const deleteConsulta = async (data: ConsultaClinica) => {
  return await axios.put(`api/eliminarConsultasClinicas/${data.id_consulta}`, {
    estado: 0,
  });
};
