import axios from "axios";

export class Game {
  async constructor() {
    deckResponse = await axios.get("https://deckofcardsapi.com/api/deck/rwlqd99vigst/shuffle/")
    this.deckID = "rwlqd99vigst";
    this.hand = [
      {
        Image: "",
        Value: -1,
        Keep: false,
      },
      {
        Image: "",
        Value: -1,
        Keep: false,
      },
      {
        Image: "",
        Value: -1,
        Keep: false,
      },
      {
        Image: "",
        Value: -1,
        Keep: false,
      },
      {
        Image: "",
        Value: -1,
        Keep: false,
      },
    ];

    this.remaning = 0;
  }
}
