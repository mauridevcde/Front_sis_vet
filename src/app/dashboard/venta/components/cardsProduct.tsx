"use client";

export default function CardsProduct() {
  function obtenerIndiceAleatorio(array) {
    if (!array || array.length === 0) {
      return -1; // Retorna -1 si el array está vacío o no existe
    }
    const nroRandom = Math.floor(Math.random() * array.length);
    return array[nroRandom];
  }

  const colores = ["#002440", "#ACCFEF", "#B6C3C9", "#FFACE1", "#FBA3A2", "#23DDDE", "#3A4B6FF", "#FFD1A2", "#23DDDE", "#A4B6FF", "#FFD1A2","#A8D9EC", "#3755A3", "#0C8388", "#0A9DA5", "#D7AE30", "#373D33", "#364559", "#23BF9D","#4C4F82", "#32B69E", "#F8A232", "#006EC0"  ];

  console.log("soy indice random", obtenerIndiceAleatorio(colores));

  return (
    <div
      onClick={() => {
        console.log("producto seleccionado");
      }}
      className="flex h-50 w-50 bg-amber-800 overflow-clip flex-wrap shadow-xl rounded-sm"
    >
      <img
        className="flex w-screen h-[60%] object-cover transition-transform duration-300"
        src={"https://www.superseis.com.py/images/thumbs/0252073.jpeg"}
      ></img>

      <div
        className="flex w-screen h-[40%]"
        style={{ backgroundColor: obtenerIndiceAleatorio(colores) }}
      ></div>
    </div>
  );
}
