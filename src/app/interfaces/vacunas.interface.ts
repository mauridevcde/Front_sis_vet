export interface Vacuna {
  id_vacuna: number;
  id_cliente: number;
  nombre_vacuna?: string;
  fecha_aplicacion?: string; // o Date
  proxima_dosis?: string;    // o Date
  id_veterinario: number;
  estado?: boolean;
}