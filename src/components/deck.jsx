export default function Hand({ hand, isFullHouse }) {
  return (
    <div className="bg-white">
      <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-5 xl:gap-x-8">
        {hand.map((card, index) => (
          <Card
            card={card}
            key={`${card.value}-${index}`}
            isFullHouse={isFullHouse}
          />
        ))}
      </div>
    </div>
  );
}

function Card({ card, id, isFullHouse }) {
  return (
    <div key={id} className="group">
      <div
        className={`w-full aspect-w-1 aspect-h-1 rounded-lg overflow-hidden xl:aspect-w-6 xl:aspect-h-8 ${
          isFullHouse ? "border-4 border-rose-500" : ""
        }`}
      >
        <img
          src={card.image}
          alt={card.value}
          className="w-full h-full object-center object-contain group-hover:opacity-75"
        />
      </div>
    </div>
  );
}
