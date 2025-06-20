export interface DetalleVenta {
  id_producto: number;
  id_usuario: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  estado: number; // o podría ser boolean si 1/0 representa true/false
  iva: number;
}
