import utils from "./utils";

describe("utils", () => {
  describe("coordEquals", () => {
    it("should show equality", () => {
      expect(utils.coordEquals({ x: 1, y: 2 }, { x: 1, y: 2 })).toBeTruthy();
    });
    it("should show inequality", () => {
      expect(utils.coordEquals({ x: 1, y: 2 }, { x: 2, y: 1 })).toBeFalsy();
    });
  });

  describe("boundingBox", () => {
    it("should return the bounding box", () => {
      const coord = { x: 1, y: 2 };
      const expected = {
        up: { x: 1, y: 3 },
        down: { x: 1, y: 1 },
        left: { x: 0, y: 2 },
        right: { x: 2, y: 2 },
      };
      expect(utils.boundingBox(coord)).toEqual(expected);
    });
  });
});
