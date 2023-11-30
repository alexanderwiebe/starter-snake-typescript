import selfCollide from "./self-collide";

describe("self-collision checks", () => {
  it("should mark up as false if body exists below head", () => {
    const myHead = { x: 1, y: 1 };
    const myBody = [
      { x: 1, y: 1 },
      { x: 1, y: 2 },
    ];
    const isMoveSafe = { up: true, down: true, left: true, right: true };
    const expected = { up: false, down: true, left: true, right: true };
    expect(selfCollide(myHead, myBody, isMoveSafe)).toEqual(expected);
  });
  it("should mark up as the only safe move", () => {
    const myHead = { x: 6, y: 2 };
    const myBody = [
      { x: 6, y: 2 },
      { x: 7, y: 2 },
      { x: 7, y: 1 },
      { x: 6, y: 1 },
      { x: 5, y: 1 },
      { x: 5, y: 2 },
      { x: 5, y: 3 },
    ];
    const isMoveSafe = { up: true, down: true, left: true, right: true };
    const expected = { up: true, down: false, left: false, right: false };
    expect(selfCollide(myHead, myBody, isMoveSafe)).toEqual(expected);
  });
});
