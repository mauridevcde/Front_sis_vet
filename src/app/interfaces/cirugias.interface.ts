export interface Cirugia {
  id_cirugia: number;
  id_cliente: number;
  fecha_cirugia: string | null;
  tipo_cirugia: string | null;
  observaciones: string | null;
  id_veterinario: number;
  estado: boolean | null;
}
