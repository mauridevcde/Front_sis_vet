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
