import axios from "axios";
import { determinCardValue } from "./utils";

export const fetchFreshDeck = async (deckID) => {
  let url = `https://deckofcardsapi.com/api/deck/${deckID}/shuffle/`;
  let resp = await axios.get(url);

  //draw first 5 cards
  let drawResp = await drawFullHand(deckID);

  let tempDeck = {
    deckID: resp.data.deck_id,
    remaining: drawResp.remaining,
    hand: drawResp.hand,
  };

  return tempDeck;
};

export const drawFullHand = async (deckID) => {
  let url = `https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=5`;

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

export const drawCards = async (gameId, count) => {
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
