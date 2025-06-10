import { Cirugia } from "@/app/interfaces/cirugias.interface";
import axios from "../axios";

export const deleteCirugia = async (data: Cirugia) => {
  return await axios.put(`api/deleteCirugia/${data.id_cirugia}`, {
    estado: 0,
  });
};
