const colores = ["#002440", "#373D33", "#006EC0"];

export function obtenerIndiceAleatorio() {
  if (!colores || colores.length === 0) {
    return -1; // Retorna -1 si el array está vacío o no existe
  }
  const nroRandom = Math.floor(Math.random() * colores.length);
  return colores[nroRandom];
}
