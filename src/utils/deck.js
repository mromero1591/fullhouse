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
