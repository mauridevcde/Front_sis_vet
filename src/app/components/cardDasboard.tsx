"use Client";

interface PropsCard {
  nameCard: string;
  dataCard: string;
}

export default function cardDasboard({ nameCard, dataCard }: PropsCard) {
  return (
    <div className="flex bg-[#101828]  w-1/6 h-50 rounded-2xl shadow-xl flex-col overflow-hidden">
      <div className="flex w-full  h-10 items-center bg-[#0E567C]  justify-center bg- mx-0">
        <h1 className="text-white font-bold">{nameCard}</h1>
      </div>
      <div className="flex w-full h-full justify-center items-center">
        <h1 className="text-white text-5xl font-bold">{dataCard}</h1>
      </div>
    </div>
  );
}
