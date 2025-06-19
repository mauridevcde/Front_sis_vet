"use client";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import { Button } from "primereact/button";
import ListPricesProductSelected from "./listPricesProductSelected";

export default function ListProductsSelected() {
  return (
    <>
      <div className="flex rounded-b-md flex-col  sm:flex-row flex-wrap gap-2 justify-center  h-full overflow-y-auto ">
        <div className="flex w-full h-10 p-1 justify-end">
          <Button
            label="Seleccionar Cliente"
            icon="pi pi-check"
            loading={false}
            onClick={() => ""}
            severity="info"
            size="small"
            text
            raised
          />
        </div>
        <div className=" p-3 h-[100%] w-full">
          <ListPricesProductSelected />
        </div>
      </div>
    </>
  );
}
