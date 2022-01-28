import { useEffect, useState } from "react";
import Card from "./components/deck";
import { drawCards, fetchFreshDeck } from "./utils/api";
import { isFullHouse, hasPair } from "./utils/deck";
import { delay } from "./utils/utils";

function App() {
  const [deck, setDeck] = useState({
    deckID: "rwlqd99vigst",
    remaining: 0,
    hand: [],
  });
  const [running, setRunning] = useState(false);
  const [handIsFullHouse, setHandIsFullHouse] = useState(false);

  useEffect(() => {
    async function setup() {
      let newDeck = await fetchFreshDeck(deck.deckID);

      setDeck(newDeck);
    }

    setup();
  }, []);

  //run: kicks off program to find a full house and in a 52 deck of cards.
  const run = async () => {
    setRunning(true);
    setHandIsFullHouse(false);

    let newDeck = await fetchFreshDeck(deck.deckID);
    setDeck(newDeck);

    while (!isFullHouse(newDeck.hand)) {
      if (newDeck.remaining === 0) {
        break;
      }

      let updatedDeck = { ...newDeck };
      updatedDeck.hand = hasPair(updatedDeck.hand);

      let update = await replaceNonPaired(updatedDeck.deckID, updatedDeck.hand);
      newDeck = {
        ...updatedDeck,
        ...update,
      };
      setDeck(updatedDeck);

      await delay(2);
    }

    if (isFullHouse(newDeck.hand)) {
      setHandIsFullHouse(true);
    } else {
      setHandIsFullHouse(false);
    }

    setRunning(false);
  };

  const replaceNonPaired = async (deckID, hand) => {
    let cardsToDiscard = [];

    for (let i = 0; i < hand.length; i++) {
      let val = hand[i];
      if (!val.keep) {
        cardsToDiscard.push(i);
      }
    }

    let newCardCount = cardsToDiscard.length;
    let resp = await drawCards(deckID, newCardCount);

    let newHand = hand;
    //replace cards
    for (let i = 0; i < resp.cards.length; i++) {
      let location = cardsToDiscard[i];
      newHand[location] = resp.cards[i];
    }

    let update = {
      remaining: resp.remaining,
      hand: newHand,
    };

    return update;
  };

  return (
    <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 lg:mt-36">
      <h2 className="text-2xl font-extrabold text-gray-900 lg:mb-12">
        Full House
      </h2>
      <Card hand={deck.hand} isFullHouse={handIsFullHouse} />
      <div className="flex justify-end mt-12">
        {running ? (
          <button
            type="button"
            className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 "
          >
            running...
          </button>
        ) : (
          <button
            onClick={run}
            type="button"
            className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Run
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
