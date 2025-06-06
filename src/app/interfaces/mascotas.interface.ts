export interface Mascota {
  id_mascota: number;
  nombre: string;
  id_categoria_animal: number;
  raza: string;
  sexo: number; // Podés usar un enum si querés representar 0 = macho, 1 = hembra
  estado: number; // Igual, podrías usar boolean si solo es activo/inactivo
  id_cliente:number;
}
