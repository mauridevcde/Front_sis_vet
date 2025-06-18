"use client";

export default function CardsProduct() {
  // function obtenerIndiceAleatorio(array: string[]) {
  //   if (!array || array.length === 0) {
  //     return -1; // Retorna -1 si el array está vacío o no existe
  //   }
  //   const nroRandom = Math.floor(Math.random() * array.length);
  //   return array[nroRandom];
  // }

  // const colores = [
  //   "#002440",

  //   "#373D33",

  //   "#006EC0",
  // ];

  // console.log("soy indice random", obtenerIndiceAleatorio(colores));

  return (
    <div
      onClick={() => {
        console.log("producto seleccionado");
      }}
      className="flex h-50 w-50 overflow-clip cursor-pointer flex-wrap shadow-xl rounded-sm hover:bg-sky-700 hover:scale-102"
    >
      <img
        className="flex w-screen h-[70%] object-cover transition-transform duration-300"
        src={"https://www.superseis.com.py/images/thumbs/0252073.jpeg"}
      ></img>

      <div
        className="flex w-screen h-[30%] flex-wrap"
        style={{ backgroundColor: "#809bce" }}
      >
        <h1 className="font-semibold text-xs leading-tight overflow-hidden p-1 text-white ">
          PURINA DOG CHOW PERRO SABOR CARNE Y POLLO 1.5 KG
        </h1>
        <span className="text-sm font-bold self-center ml-3 text-white  ">
          58.000 Gs.
        </span>
      </div>
    </div>
  );
}
