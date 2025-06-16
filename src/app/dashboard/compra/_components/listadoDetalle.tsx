"use client";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useCompraStore } from "../store/compraStore";
import { Button } from "primereact/button";

export default function ListadoDetalles() {
  const productos = useCompraStore((state) => state.productos);
  const calulateTotal = useCompraStore((state) => state.calcularTotales);
  const setRemoveDetails = useCompraStore((state) => state.removeProducto); // Assuming your store has a setProductos action

  const confirmDeleteProduct = (product) => {
    setRemoveDetails(product.id_producto);
    calulateTotal();
  };
  const mostrarSubTotal = (rowData) => {
    const Subtotal = rowData.cantidad * rowData.precio_compra;
    return <>{Intl.NumberFormat("es-ES").format(Subtotal)}</>;
  };
  const mostrarPrecioCompra = (rowData) => {
    return <>{Intl.NumberFormat("es-ES").format(rowData.precio_compra)}</>;
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <>
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          onClick={() => confirmDeleteProduct(rowData)}
          style={{ width: "30px", height: "30px" }}
        />
      </>
    );
  };
  return (
    <div className="flex w-[100] h-[70%] flex-wrap overflow-scroll ">
      {productos.length <= 0 ? (
        <h2>Seleciona al menos 1 producto para comprar del proveedor!</h2>
      ) : (
        <DataTable
          showGridlines
          value={productos}
          // headerColumnGroup={headerGroup}
          // footerColumnGroup={footerGroup}
          size="small"
          tableStyle={{
            minWidth: "auto",
            maxWidth: "auto",
            width: "auto",
            fontSize: "10px",
          }}
        >
          <Column field="id_producto" style={{ width: "30px" }} header="ID" />
          <Column
            field="nombre"
            body={""}
            style={{ width: "300px" }}
            header="Descripcion"
          />
          <Column field="" body={mostrarPrecioCompra} header="Precio" />
          <Column field="cantidad" body={""} header="Cantidad" />
          <Column field="" body={mostrarSubTotal} header="SubTotal" />
          <Column field="" body={actionBodyTemplate} header="Borrar" />
        </DataTable>
      )}
    </div>
  );
}
