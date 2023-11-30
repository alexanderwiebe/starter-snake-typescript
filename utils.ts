import { Coord } from "./types";

export default {
  coordEquals: function (coord1: Coord, coord2: Coord) {
    return coord1.x === coord2.x && coord1.y === coord2.y;
  },
  coordUp: function ({ x, y }: Coord) {
    return { x, y: y + 1 };
  },
  coordDown: function ({ x, y }: Coord) {
    return { x, y: y - 1 };
  },
  coordLeft: function ({ x, y }: Coord) {
    return { x: x - 1, y };
  },
  coordRight: function ({ x, y }: Coord) {
    return { x: x + 1, y };
  },
  boundingBox: function (coord: Coord) {
    return {
      up: this.coordUp(coord),
      down: this.coordDown(coord),
      left: this.coordLeft(coord),
      right: this.coordRight(coord),
    };
  },
};
