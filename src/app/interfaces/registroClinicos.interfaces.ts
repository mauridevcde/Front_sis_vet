export interface RegistroClinico {
  id_registro_clinico: number;
  Descripcion?: string | null;
  fecha?: string | null; //
  id_cliente: number;
  estado?: boolean | null;
}
