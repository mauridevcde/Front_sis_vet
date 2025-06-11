export interface DetalleCompra {
  id_detalle_compra: number;
  id_compra: number;
  id_producto: number;
  id_usuario: number;
  cantidad?: number | null;
  costo?: number | null;
  subtotal?: number | null;
  iva?: number | null;
  CostoMedio?: number | null;
}
