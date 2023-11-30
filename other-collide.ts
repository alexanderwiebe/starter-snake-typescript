import { Battlesnake, Coord } from "./types";
import utils from "./utils";

export default function (
  myHead: Coord,
  snakes: Battlesnake[],
  isMoveSafe: { [key: string]: boolean }
) {
  const { up, down, left, right } = utils.boundingBox(myHead);
  for (let j = 0; j < snakes.length; j++) {
    for (let i = 0; i < snakes[j].body.length; i++) {
      if (utils.coordEquals(snakes[j].body[i], up)) {
        isMoveSafe.up = false;
      }
      if (utils.coordEquals(snakes[j].body[i], down)) {
        isMoveSafe.down = false;
      }
      if (utils.coordEquals(snakes[j].body[i], left)) {
        isMoveSafe.left = false;
      }
      if (utils.coordEquals(snakes[j].body[i], right)) {
        isMoveSafe.right = false;
      }
    }
  }
  return isMoveSafe;
}
