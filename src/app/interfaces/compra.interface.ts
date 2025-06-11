export interface Compra {
  id_compra: number;
  id_proveedor: number;
  id_usuario: number;
  TotalNeto?: number ;
  estado?: "pendiente" | "recibida" | "anulada" ;
  fecha_compra?: string; // ISO 8601 string (ej: "2025-06-11T14:00:00Z")
  FacturaNro?: string;
  TipoDeCompra?: string;
  Iva0?: number;
  Iva5?: number;
  Iva10?: number;
  SubTotal?: number;
}
