"use client";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import { Button } from "primereact/button";
import ListPricesProductSelected from "./listPricesProductSelected";
import { useVentaStore } from "../store/storeVenta";
import ModalSelectedClient from "./modalSelectedClient";

export default function ListProductsSelected() {
  const productsStore = useVentaStore((state) => state.productos);
  const setOpenModal = useVentaStore((state) => state.modalClientes);
  const cliente = useVentaStore((state) => state.cliente);

  return (
    <>
      <ModalSelectedClient />
      <div className="flex rounded-b-md flex-col  sm:flex-row flex-wrap gap-2 justify-center  h-full overflow-y-auto ">
        <div className="flex w-full h-10 p-1 justify-between ">
          {cliente == null ? (
            ""
          ) : (
            <span>Cliente: {cliente.nombre_apellido}</span>
          )}
          <Button
            label="Seleccionar Cliente"
            icon="pi pi-check"
            loading={false}
            onClick={() => setOpenModal(true)}
            severity="info"
            size="small"
            text
            raised
          />
        </div>
        <div className=" p-3 h-[100%] w-full">
          {productsStore.length <= 0 ? (
            "Seleccione un producto..."
          ) : (
            <>
              {productsStore.map((value) => (
                <ListPricesProductSelected key={value.id_producto} {...value} />
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
}
