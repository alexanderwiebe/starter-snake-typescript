// Welcome to
// __________         __    __  .__                               __
// \______   \_____ _/  |__/  |_|  |   ____   ______ ____ _____  |  | __ ____
//  |    |  _/\__  \\   __\   __\  | _/ __ \ /  ___//    \\__  \ |  |/ // __ \
//  |    |   \ / __ \|  |  |  | |  |_\  ___/ \___ \|   |  \/ __ \|    <\  ___/
//  |________/(______/__|  |__| |____/\_____>______>___|__(______/__|__\\_____>
//
// This file can be a nice home for your Battlesnake logic and helper functions.
//
// To get you started we've included code to prevent your Battlesnake from moving backwards.
// For more info see docs.battlesnake.com

import otherCollide from "./other-collide";
import selfCollide from "./self-collide";
import runServer from "./server";
import { GameState, InfoResponse, MoveResponse } from "./types";

// info is called when you create your Battlesnake on play.battlesnake.com
// and controls your Battlesnake's appearance
// TIP: If you open your Battlesnake URL in a browser you should see this data
export function info(): InfoResponse {
  console.log("INFO");

  return {
    apiversion: "1",
    author: "AJ Wiebe", // TODO: Your Battlesnake Username
    color: "#02bec1", // TODO: Choose color
    head: "gamer", // TODO: Choose head
    tail: "bolt", // TODO: Choose tail
  };
}

// start is called when your Battlesnake begins a game
function start(gameState: GameState): void {
  console.log("GAME START");
}

// end is called when your Battlesnake finishes a game
function end(gameState: GameState): void {
  console.log("GAME OVER\n");
}

// move is called on every turn and returns your next move
// Valid moves are "up", "down", "left", or "right"
// See https://docs.battlesnake.com/api/example-move for available data
function move(gameState: GameState): MoveResponse {
  let isMoveSafe: { [key: string]: boolean } = {
    up: true,
    down: true,
    left: true,
    right: true,
  };

  // We've included code to prevent your Battlesnake from moving backwards
  const myHead = gameState.you.body[0];
  const myNeck = gameState.you.body[1];

  if (myNeck.x < myHead.x) {
    // Neck is left of head, don't move left
    isMoveSafe.left = false;
  } else if (myNeck.x > myHead.x) {
    // Neck is right of head, don't move right
    isMoveSafe.right = false;
  } else if (myNeck.y < myHead.y) {
    // Neck is below head, don't move down
    isMoveSafe.down = false;
  } else if (myNeck.y > myHead.y) {
    // Neck is above head, don't move up
    isMoveSafe.up = false;
  }

  // TODO: Step 1 - Prevent your Battlesnake from moving out of bounds
  const boardWidth = gameState.board.width;
  const boardHeight = gameState.board.height;
  if (myHead.x == 0) {
    isMoveSafe.left = false;
  }
  if (myHead.x == boardWidth - 1) {
    isMoveSafe.right = false;
  }
  if (myHead.y == 0) {
    isMoveSafe.down = false;
  }
  if (myHead.y == boardHeight - 1) {
    isMoveSafe.up = false;
  }

  // TODO: Step 2 - Prevent your Battlesnake from colliding with itself
  isMoveSafe = selfCollide(myHead, gameState.you.body, isMoveSafe);

  // TODO: Step 3 - Prevent your Battlesnake from colliding with other Battlesnakes
  isMoveSafe = otherCollide(myHead, gameState.board.snakes, isMoveSafe);

  // TODO: Step 4 - Move towards food instead of random, to regain health and survive longer
  const food = gameState.board.food;
  let closestFood = food[0];
  let closestDistance =
    Math.abs(myHead.x - closestFood.x) + Math.abs(myHead.y - closestFood.y);
  for (let i = 1; i < food.length; i++) {
    const distance =
      Math.abs(myHead.x - food[i].x) + Math.abs(myHead.y - food[i].y);
    if (distance < closestDistance) {
      closestFood = food[i];
      closestDistance = distance;
    }
  }

  // TODO: find the closest food accounting for other snakes

  let isMoveDesired: { [key: string]: boolean } = {
    up: true,
    down: true,
    left: true,
    right: true,
  };

  if (closestFood.x < myHead.x) {
    isMoveDesired.left = true;
    isMoveDesired.right = false;
  } else if (closestFood.x > myHead.x) {
    isMoveDesired.left = false;
    isMoveDesired.right = true;
  } else {
    isMoveDesired.left = false;
    isMoveDesired.right = false;
  }
  if (closestFood.y < myHead.y) {
    isMoveDesired.up = false;
    isMoveDesired.down = true;
  } else if (closestFood.y > myHead.y) {
    isMoveDesired.up = true;
    isMoveDesired.down = false;
  } else {
    isMoveDesired.up = false;
    isMoveDesired.down = false;
  }

  // Are there any safe moves left?
  const safeMoves = Object.keys(isMoveSafe).filter((key) => isMoveSafe[key]);
  const desiredMoves = Object.keys(isMoveDesired).filter(
    (key) => isMoveDesired[key]
  );

  //Backup
  if (safeMoves.length == 0 && desiredMoves.length == 0) {
    return { move: "down" };
  }
  if (desiredMoves.length == 0) {
    // random safe move
    const nextMove = safeMoves[Math.floor(Math.random() * safeMoves.length)];
    return { move: nextMove };
  }

  let desiredSafeMoves: string[] = [];
  safeMoves.forEach((move) => {
    if (desiredMoves.includes(move)) {
      desiredSafeMoves.push(move);
    }
  });

  if (desiredSafeMoves.length == 0) {
    desiredSafeMoves = safeMoves; // you can try sometimes but you just might find
    // you get what you need
  }

  // todo should figure out metric on safer moves
  let nextMove =
    desiredSafeMoves[Math.floor(Math.random() * desiredSafeMoves.length)];

  if (desiredSafeMoves.length == 1) {
    nextMove = desiredSafeMoves[0];
  } else {
    // todo optimize for space?
    // todo optimize for food?
    // todo optimize for eliminating other snakes?
  }

  if (!nextMove) {
    console.error(`MOVE ${gameState.turn}: Moving ${nextMove}`);
    console.error(`PANIC`);
    return {
      move: ["up", "down", "left", "right"][Math.floor(Math.random() * 4)],
    };
  }
  return { move: nextMove };
}

runServer({
  info: info,
  start: start,
  move: move,
  end: end,
});
