//soft delete

// services/putCliente.ts
import { Cliente } from "@/app/interfaces/cliente.interface";
import axios from "../axios";

export const deleteClientes = async (data: Cliente) => {
  return await axios.put(`api/deleteClientes/${data.id_cliente}`, {
    estado: 0,
  });
};
