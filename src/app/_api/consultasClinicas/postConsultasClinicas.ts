import { ConsultaClinica } from "@/app/interfaces/consultasClinicas.interface";
import axios from "../axios";

export const postConsulta = async (data: ConsultaClinica) => {
  return await axios.post("api/consultasClinicas", {
    id_cliente: data.id_cliente,
    fecha_consulta: data.fecha_consulta,
    motivo: data.motivo,
    sintomas: data.sintomas,
    diagnostico: data.diagnostico,
    tratamiento: data.tratamiento,
    observaciones: data.observaciones,
    peso_kg: data.peso_kg,
    temperatura_c: data.temperatura_c,
    id_veterinario: data.id_veterinario,
    estado: 1,
  });
};
