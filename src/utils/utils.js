export const sortCards = (a, b) => {
  let comp = 0;
  if (a.value > b.value) {
    comp = 1;
  } else if (a.value < b.value) {
    comp = -1;
  }

  return comp;
};

export const delay = (n) => {
  return new Promise(function (resolve) {
    setTimeout(resolve, n * 1000);
  });
};

export const determinCardValue = (value) => {
  let cardValues = {
    ACE: 0,
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    10: 10,
    JACK: 11,
    QUEEN: 12,
    KING: 13,
  };

  return cardValues[value];
};
