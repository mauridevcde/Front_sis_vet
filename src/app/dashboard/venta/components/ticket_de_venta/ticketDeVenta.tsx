// generarPDFVenta.ts
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Venta } from "@/app/interfaces/venta/venta.interface";
import { DetalleVenta } from "@/app/interfaces/venta/detalle_ventas.interface";

export const generarPDFVenta = (
  venta: Venta & { id_venta: number },
  detalles: DetalleVenta[],
  pago: { efectivo: number; cambio: number }
) => {
  const doc = new jsPDF();

  doc.setFontSize(10);
  doc.text("CWIN Systems", 10, 10);
  doc.text(`Fecha: ${new Date(venta.fecha_venta).toLocaleString()}`, 10, 15);
  doc.text(`Ticket No: ${venta.id_venta}`, 10, 20);

  autoTable(doc, {
    startY: 25,
    head: [["Cant", "Descripción", "Precio", "Importe"]],
    body: detalles.map((d) => [
      d.cantidad,
      d.id_producto ?? `Producto ${d.id_producto}`,
      d.precio_unitario.toFixed(2),
      d.subtotal.toFixed(2),
    ]),
  });

  const lastY = (doc as any).lastAutoTable.finalY ?? 40;

  doc.text(`Total Neto: $${venta.total.toFixed(2)}`, 140, lastY + 10);
  doc.text(`Efectivo: $${pago.efectivo.toFixed(2)}`, 10, lastY + 20);
  doc.text(`Cambio: $${pago.cambio.toFixed(2)}`, 10, lastY + 25);
  doc.text("Gracias por su compra!", 70, lastY + 40);

  doc.save(`ticket_${venta.id_venta}.pdf`);
};
