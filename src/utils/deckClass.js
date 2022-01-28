import axios from "axios";
import { determinCardValue } from "./utils";

export class Deck {
  constructor(id, remaining) {
    this.id = id;
    this.remaining = remaining;
    this.hand = [];
  }

  async resetDeck() {
    let url = `https://deckofcardsapi.com/api/deck/${this.id}/shuffle/`;
    let resp = await axios.get(url);

    this.remaining = resp.data.remaining;
  }

  async drawFullHand() {
    let url = `https://deckofcardsapi.com/api/deck/${this.id}/draw/?count=5`;

    let resp = await axios.get(url);

    let hand = [];

    for (const card of resp.data.cards) {
      hand.push({
        image: card.image,
        value: determinCardValue(card.value),
        keep: false,
      });
    }

    this.remaining = resp.data.remaining;
    this.hand = hand;
  }

  setHand(hand) {
    this.hand = hand;
  }

  setRemaining(remaining) {
    this.remaining = remaining;
  }
}

export const hasPair = (hand) => {
  let existMap = new Map();
  let hasPairHand = hand;

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

  return hasPairHand;
};
