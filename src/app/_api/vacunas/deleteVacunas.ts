import { Vacuna } from "@/app/interfaces/vacunas.interface";

import axios from "../axios";

export const deleteVacuna = async (data: Vacuna) => {
  return await axios.put(`api/deleteVacunas/${data.id_vacuna}`, {
    estado: 0,
  });
};
