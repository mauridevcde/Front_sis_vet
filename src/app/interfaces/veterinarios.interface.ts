export interface Veterinario {
  id_veterinario: number; // Campo autoincremental (no null)
  nombre_apellido?: string | null; // Puede ser null
  matricula?: string | null; // Puede ser null
  estado?: boolean | null; // tinyint(1) usualmente representa un booleano
}
