export interface ConsultaClinica {
  id_consulta: number;
  id_cliente: number;
  fecha_consulta: Date ;
  motivo: string | null;
  sintomas: string | null;
  diagnostico: string | null;
  tratamiento: string | null;
  observaciones: string | null;
  peso_kg: number | null;
  temperatura_c: number | null;
  id_veterinario: number;
  estado: number | null;
}