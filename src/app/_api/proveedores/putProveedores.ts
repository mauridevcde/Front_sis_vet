// services/putCliente.ts
import { Proveedor } from "@/app/interfaces/proveedores.interface";
import axios from "../axios";

export const putProveedor = async (data: Proveedor) => {
  return await axios.put(`api/editarProveedores/${data.id_proveedor}`, {
    descripcion: data.descripcion,
    razon_social: data.razon_social,
    ruc: data.ruc,
    direccion: data.direccion,
    estado: 1,
  });
};
