"use client";

export default function CardsProduct() {
  const generateColor = () => {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return "#" + randomColor;
  };

  return (
    <div
      onClick={() => {
        console.log("producto seleccionado");
      }}
      className="flex h-50 w-50 bg-amber-50 flex-wrap"
    >
      <img
        className="flex w-screen h-[60%] object-cover transition-transform duration-300"
        src={"https://www.superseis.com.py/images/thumbs/0252073.jpeg"}
      ></img>

      <div
        className="flex w-screen h-[40%]"
        style={{ backgroundColor: generateColor() }}
      ></div>
    </div>
  );
}
