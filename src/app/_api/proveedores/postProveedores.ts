import { Proveedor } from "@/app/interfaces/proveedores.interface";
import axios from "../axios";

export const postProveedor = async (data: Proveedor) => {
  return await axios.post("api/proveedores", {
    descripcion: data.descripcion,
    razon_social: data.razon_social,
    ruc: data.ruc,
    direccion: data.direccion,
    estado: 1,
  });
};
