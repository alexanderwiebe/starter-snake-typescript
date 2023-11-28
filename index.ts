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

import runServer from "./server";
import { GameState, InfoResponse, MoveResponse } from "./types";

// info is called when you create your Battlesnake on play.battlesnake.com
// and controls your Battlesnake's appearance
// TIP: If you open your Battlesnake URL in a browser you should see this data
function info(): InfoResponse {
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
  const myBody = gameState.you.body;
  for (let i = 1; i < myBody.length; i++) {
    if (myBody[i].x == myHead.x && myBody[i].y == myHead.y - 1) {
      isMoveSafe.up = false;
    }
    if (myBody[i].x == myHead.x && myBody[i].y == myHead.y + 1) {
      isMoveSafe.down = false;
    }
    if (myBody[i].x == myHead.x - 1 && myBody[i].y == myHead.y) {
      isMoveSafe.left = false;
    }
    if (myBody[i].x == myHead.x + 1 && myBody[i].y == myHead.y) {
      isMoveSafe.right = false;
    }
  }

  // TODO: Step 3 - Prevent your Battlesnake from colliding with other Battlesnakes
  const opponents = gameState.board.snakes;
  for (let i = 0; i < opponents.length; i++) {
    const opponentBody = opponents[i].body;
    for (let j = 0; j < opponentBody.length; j++) {
      if (opponentBody[j].x == myHead.x && opponentBody[j].y == myHead.y - 1) {
        isMoveSafe.up = false;
      }
      if (opponentBody[j].x == myHead.x && opponentBody[j].y == myHead.y + 1) {
        isMoveSafe.down = false;
      }
      if (opponentBody[j].x == myHead.x - 1 && opponentBody[j].y == myHead.y) {
        isMoveSafe.left = false;
      }
      if (opponentBody[j].x == myHead.x + 1 && opponentBody[j].y == myHead.y) {
        isMoveSafe.right = false;
      }
    }
  }

  // Choose a random move from the safe moves
  //

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
  if (safeMoves.length == 0 && desiredMoves.length == 0) {
    console.log(`MOVE ${gameState.turn}: No safe moves detected! Moving down`);
    return { move: "down" };
  }
  if (desiredMoves.length == 0) {
    // random safe move
    const nextMove = safeMoves[Math.floor(Math.random() * safeMoves.length)];
    console.log(
      `MOVE ${gameState.turn}: No desired moves detected! Moving ${nextMove}`
    );
    return { move: nextMove };
  }

  let desiredSafeMoves: string[] = [];
  safeMoves.forEach((move) => {
    if (desiredMoves.includes(move)) {
      desiredMoves.push(move);
    }
  });

  const nextMove =
    desiredSafeMoves[Math.floor(Math.random() * desiredSafeMoves.length)];

  console.log(`MOVE ${gameState.turn}: ${nextMove}`);
  return { move: nextMove };
}

runServer({
  info: info,
  start: start,
  move: move,
  end: end,
});
