import axios from "axios";
import { determinCardValue } from "./utils";

//fetchFresDeck: take in a deckID and reshufles the deck. placing all cards back into the deck
//returns: the deck with a new full hand.
export const fetchFreshDeck = async (deckID) => {
  let url = `https://deckofcardsapi.com/api/deck/${deckID}/shuffle/`;
  let resp = await axios.get(url);

  let drawResp = await drawCards(deckID, 5);

  let tempDeck = {
    deckID: resp.data.deck_id,
    remaining: drawResp.remaining,
    hand: drawResp.cards,
  };

  return tempDeck;
};

//drawFullHand: using a deckId, a count this will draw n new cards from the given deck.
export const drawCards = async (deckID, count) => {
  let url = `https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=${count}`;

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
