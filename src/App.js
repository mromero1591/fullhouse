import { useEffect, useState } from "react";
import Card from "./components/deck";
import { drawCards, fetchFreshDeck } from "./utils/api";
import { isFullHouse, hasPair } from "./utils/deck";

function App() {
  const [deck, setDeck] = useState({
    deckID: "rwlqd99vigst",
    remaining: 0,
    hand: [],
  });

  const [gameRunning, setGameRunning] = useState(false);
  const [isFullHouseClass, setIsFullHouseClass] = useState(false);
  useEffect(() => {
    async function setup() {
      let newGame = await fetchFreshDeck(deck.deckID);

      setDeck(newGame);
    }

    setup();
  }, []);

  const runGame = async () => {
    setGameRunning(true);
    let newDeck = await fetchFreshDeck(deck.deckID);
    setDeck(newDeck);
    setIsFullHouseClass(false);
    while (!isFullHouse(newDeck.hand)) {
      if (newDeck.remaining === 0) {
        break;
      }

      let updatedDeck = { ...newDeck };
      updatedDeck.hand = hasPair(updatedDeck.hand);

      updatedDeck = await replaceNonPaired(updatedDeck);
      newDeck = updatedDeck;
      setDeck(updatedDeck);

      // await delay(1);
    }

    if (isFullHouse(newDeck.hand)) {
      setIsFullHouseClass(true);
    } else {
      setIsFullHouseClass(false);
    }

    setGameRunning(false);
  };

  const replaceNonPaired = async (game) => {
    let cardsToDiscard = [];

    for (let i = 0; i < game.hand.length; i++) {
      let val = game.hand[i];
      if (!val.keep) {
        cardsToDiscard.push(i);
      }
    }

    let newCardCount = cardsToDiscard.length;
    let resp = await drawCards(game.deckID, newCardCount);

    let newHand = game.hand;
    //replace cards
    for (let i = 0; i < resp.cards.length; i++) {
      let location = cardsToDiscard[i];
      newHand[location] = resp.cards[i];
    }

    let updatedGame = {
      ...game,
      remaining: resp.remaining,
      hand: newHand,
    };

    return updatedGame;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:mt-36">
      <h2 className="text-2xl font-extrabold text-gray-900 lg:mb-12">
        Full House
      </h2>
      <Card hand={deck.hand} isFullHouse={isFullHouseClass} />
      <div className="flex justify-end mt-12">
        {gameRunning ? (
          <button
            type="button"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 "
          >
            game running...
          </button>
        ) : (
          <button
            onClick={runGame}
            type="button"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Start Game
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
