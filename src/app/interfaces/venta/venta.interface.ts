export interface Venta {
  id_cliente: number;
  id_usuario: number;
  fecha_venta: string; // o Date si lo conviertes
  total: number;
  estado: "pagada" | "pendiente" | "cancelada"; // valores posibles
  tipo_pago: "efectivo" | "tarjeta" | "transferencia"; // valores posibles
  tipo_venta: "contado" | "credito"; // valores posibles
  subTotal: number;
  Iva0: number;
  Iva5: number;
  Iva10: number;
  TotalDescuento: number;
  id_caja: string | number;
}
