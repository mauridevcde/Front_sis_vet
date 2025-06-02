import { Proveedor } from "@/app/interfaces/proveedores.interface";
import axios from "../axios";

export const deleteProveedores = async (data: Proveedor) => {
  return await axios.put(`api/deleteProveedor/${data.id_proveedor}`, {
    estado: 0,
  });
};
