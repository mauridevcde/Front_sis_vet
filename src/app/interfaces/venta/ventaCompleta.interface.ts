import { DetalleVenta } from "./detalle_ventas.interface";
import { Venta } from "./venta.interface";

export interface VentaCompleta {
  venta: Venta;
  detalles: DetalleVenta[];
}