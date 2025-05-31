// services/data.ts
import { Cliente } from "../../../interfaces/cliente.interface";

export const ProductService = {
  getProducts(): Promise<Cliente[]> {
    return Promise.resolve([
      {
        id_cliente: 1,
        nombre_apellido: "Mauricio González",
        ruc: "80012345-6",
        ci: "1234567",
        nro_tel: "0981123456",
        direccion: "Av. Principal 123",
        correo: "mauricio@example.com",
        id_mascota: 1,
        estado: 1,
      },
      {
        id_cliente: 2,
        nombre_apellido: "Laura Martínez",
        ruc: "80067890-2",
        ci: "9876543",
        nro_tel: "0972123456",
        direccion: "Calle Falsa 456",
        correo: "laura@example.com",
        id_mascota: 2,
        estado: 1,
      },
      {
        id_cliente: 3,
        nombre_apellido: "Carlos López",
        ruc: "80099887-5",
        ci: "1357924",
        nro_tel: "0999123456",
        direccion: "Ruta 3 km 12",
        correo: "carlos@example.com",
        id_mascota: 3,
        estado: 0,
      },
    ]);
  },
};
