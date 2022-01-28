import { drawCards } from "./api";
import { sortCards } from "./utils";

export const isFullHouse = (hand) => {
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

export const findAllPairsInHand = (hand) => {
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
        cardFromMap.count += 1;
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

//replaceNonPaired: will reaplce any non paried cards with new cards from the deck.
export const replaceNonPaired = async (deckID, hand) => {
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
    remainingCards: resp.remaining,
    hand: newHand,
  };

  return update;
};
