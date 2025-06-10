export function formatToLocalSqlDatetime(date: Date): string {
  const [fecha, hora] = date
    .toLocaleString("sv-SE", { hour12: false }) // 'sv-SE' = YYYY-MM-DD HH:mm:ss
    .split(" ");

  return `${fecha} ${hora}`;
}

export function formatToSqlDatetimeTable(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
    date.getSeconds()
  )}`;
}

// Función para formatear fecha ISO a yyyy-MM-dd (para input type="date")
export function formatDateForInput(dateString: string | null) {
  if (!dateString) return "";
  // Si ya está en formato yyyy-MM-dd, lo devolvemos directamente
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString;
  // Si es formato ISO, extraemos la parte de la fecha
  return dateString.split("T")[0];
}

// Función para convertir a formato MySQL (yyyy-MM-dd)
export function formatDateForMySQL(dateString: string | null) {
  if (!dateString) return null;
  // Si ya está en formato yyyy-MM-dd, lo devolvemos directamente
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString;
  // Si es formato ISO, extraemos la parte de la fecha
  return dateString.split("T")[0];
}
