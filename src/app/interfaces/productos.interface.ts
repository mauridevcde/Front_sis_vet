export interface Producto {
  id_producto: number;
  nombre: string;
  fecha_vencimiento: string; // ISO format (e.g., "2022-04-12T04:00:00")
  id_proveedor: number;
  stock: number;
  precio_compra: number;
  precio_venta: number;
  unidad_medida: string;
  imagen: string;
  estado: number; // 1 = activo, 0 = inactivo
  TipoDeVenta: string; // "Contado" | "Crédito" etc.
  iva: number; // e.g., 0, 5, 10, etc. o boolean si se desea modelar como true/false
  id_usuario: number;
  codigoDeBarra: string;
}
