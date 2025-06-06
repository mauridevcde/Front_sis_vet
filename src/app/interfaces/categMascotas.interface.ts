export interface CategoriaMascota {
  id_categoria_mascota: number; // Identificador único, autoincremental
  descripcion?: string | null;  // Opcional, puede ser null
  estado?: boolean;             // Opcional, tinyint(1) interpretado como booleano
}