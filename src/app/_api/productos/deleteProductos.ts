import { Producto } from "@/app/interfaces/productos.interface";
import axios from "../axios";

export const deleteProducto = async (data: Producto) => {
  return await axios.put(`api/eliminarProductos/${data.id_producto}`, {
    estado: 0,
  });
};
