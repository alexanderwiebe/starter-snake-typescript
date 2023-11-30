import { Coord } from "./types";
import utils from "./utils";

export default function (
  myHead: Coord,
  myBody: Coord[],
  isMoveSafe: { [key: string]: boolean }
) {
  const { up, down, left, right } = utils.boundingBox(myHead);
  for (let i = 1; i < myBody.length; i++) {
    if (utils.coordEquals(myBody[i], up)) {
      isMoveSafe.up = false;
    }
    if (utils.coordEquals(myBody[i], down)) {
      isMoveSafe.down = false;
    }
    if (utils.coordEquals(myBody[i], left)) {
      isMoveSafe.left = false;
    }
    if (utils.coordEquals(myBody[i], right)) {
      isMoveSafe.right = false;
    }
  }
  return isMoveSafe;
}
