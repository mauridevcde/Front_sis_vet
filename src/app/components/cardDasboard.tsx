"use Client";

interface PropsCard {
  nameCard: string;
  dataCard: string;
}

export default function cardDasboard({ nameCard, dataCard }: PropsCard) {
  return (
    <div className="relative  shadow-xl rounded-md overflow-hidden w-full max-w-md mx-auto ">
      <div className="flex justify-center items-center  bg-[#0E567C]  ">
        <h1 className="text-white font-bold">{nameCard}</h1>
      </div>
      <div className="p-6 flex justify-center items-center min-h-[120px]">
        <h1 className="text-black text-5xl font-bold">{dataCard}</h1>
      </div>
    </div>
  );
}
