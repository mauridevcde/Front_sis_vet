import axios from "../axios";
import { Producto } from "@/app/interfaces/productos.interface";

export const postProducto = async (data: Producto) => {
  return await axios.post("api/productos", {
    nombre: data.nombre,
    fecha_vencimiento: data.fecha_vencimiento,
    id_proveedor: data.id_proveedor,
    stock: data.stock,
    precio_compra: data.precio_compra,
    precio_venta: data.precio_venta,
    unidad_medida: data.unidad_medida,
    imagen: data.imagen,
    estado: data.estado,
    TipoDeVenta: data.TipoDeVenta,
    iva: data.iva,
    id_usuario: data.id_usuario,
    codigoDeBarra: data.codigoDeBarra,
  });
};
