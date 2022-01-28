import axios from "axios";
import { useEffect, useState } from "react";
import Card from "./components/deck";
import { delay, sortCards, determinCardValue } from "./utils/utils";

/*
Card struct {
		Image string `json:"image"`
		Value int    `json:"value"`
		Keep  bool   `json:"false"`
	}
*/

function App() {
  const [game, setGame] = useState({
    deckID: "",
    remaining: 0,
    hand: [],
  });

  const [gameRunning, setGameRunning] = useState(false);
  const [isFullHouseClass, setIsFullHouseClass] = useState(false);
  useEffect(() => {
    async function setup() {
      let newGame = await resetGame();

      setGame(newGame);
    }

    setup();
  }, []);

  const resetGame = async () => {
    let url = "https://deckofcardsapi.com/api/deck/rwlqd99vigst/shuffle/";
    let resp = await axios.get(url);

    //draw first 5 cards
    let drawResp = await drawFullHand();

    let tempGame = {
      deckID: resp.data.deck_id,
      remaining: drawResp.remaining,
      hand: drawResp.hand,
    };

    return tempGame;
  };

  const drawFullHand = async () => {
    let url = "https://deckofcardsapi.com/api/deck/rwlqd99vigst/draw/?count=5";

    let resp = await axios.get(url);

    let hand = [];

    for (const card of resp.data.cards) {
      hand.push({
        image: card.image,
        value: determinCardValue(card.value),
        keep: false,
      });
    }

    return {
      hand: hand,
      remaining: resp.data.remaining,
    };
  };

  const runGame = async () => {
    setGameRunning(true);
    let newGame = await resetGame();
    setGame(newGame);
    setIsFullHouseClass(false);
    while (!isFullHouse(newGame.hand)) {
      if (newGame.remaining === 0) {
        // newGame = await resetGame();
        // setGame(newGame);
        break;
      }

      let updatedGame = { ...newGame };
      updatedGame = hasPair(updatedGame);
      updatedGame = await replaceNonPaired(updatedGame);
      //updatedGame.hand.sort(sortCards);
      newGame = updatedGame;
      setGame(updatedGame);

      // await delay(1);
    }

    if (isFullHouse(newGame.hand)) {
      setIsFullHouseClass(true);
    } else {
      setIsFullHouseClass(false);
    }

    setGameRunning(false);
  };

  const isFullHouse = (hand) => {
    if (hand.length < 5) {
      return false;
    }

    hand.sort(sortCards);

    let threeOfAKindFirst =
      hand[0].value === hand[1].value &&
      hand[1].value === hand[2].value &&
      hand[3].value === hand[4].value;
    let twoOfAKindFirst =
      hand[0].value === hand[1].value &&
      hand[2].value === hand[3].value &&
      hand[3].value === hand[4].value;

    return threeOfAKindFirst || twoOfAKindFirst;
  };

  const hasPair = (updatedGame) => {
    let existMap = new Map();
    let hasPairHand = updatedGame.hand;

    for (let i = 0; i < hasPairHand.length; i++) {
      let card = hasPairHand[i];
      card.keep = false;
      let cardFromMap = existMap.get(card.value);

      if (cardFromMap != null) {
        if (cardFromMap.count < 3) {
          hasPairHand[i].keep = true;
          hasPairHand[cardFromMap.loc].keep = true;
          let updatedCardFromMap = {
            ...cardFromMap,
            count: cardFromMap.count + 1,
          };
          existMap.set(card.value, updatedCardFromMap);
        }
      } else {
        existMap.set(card.value, {
          loc: i,
          count: 1,
          value: card.value,
        });
      }
    }

    return {
      ...updatedGame,
      hand: hasPairHand,
    };
  };

  const replaceNonPaired = async (game) => {
    //keep track of the cards that do not have a pair
    let cardsToDiscard = [];

    for (let i = 0; i < game.hand.length; i++) {
      let val = game.hand[i];
      if (!val.keep) {
        cardsToDiscard.push(i);
      }
    }

    //make a call for the length of cards to discard

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

  const drawCards = async (gameId, count) => {
    let url = `https://deckofcardsapi.com/api/deck/${gameId}/draw/?count=${count}`;

    let resp = await axios.get(url);

    let cardsFromAPI = resp.data.cards;
    let newCards = [];

    for (let i = 0; i < cardsFromAPI.length; i++) {
      let tempCard = {
        image: cardsFromAPI[i].image,
        value: determinCardValue(cardsFromAPI[i].value),
        keep: false,
      };

      newCards.push(tempCard);
    }

    return {
      cards: newCards,
      remaining: resp.data.remaining,
    };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:mt-36">
      <h2 className="text-2xl font-extrabold text-gray-900 lg:mb-12">
        Full House
      </h2>
      <Card hand={game.hand} isFullHouse={isFullHouseClass} />
      <div className="flex justify-end mt-12">
        {gameRunning ? (
          <button
            onClick={runGame}
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
