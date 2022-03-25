import Grid from "./grid.js";
import Tile from "./tile.js";

const gameBoard = document.getElementById("boardGame");

const grid = new Grid(gameBoard);
grid.randomEmptyCell().tile = new Tile(gameBoard);
grid.randomEmptyCell().tile = new Tile(gameBoard);
//makes new tile object with class=tile, then gets random epmty cell with x and y, then sets x and y of new created tile to the same as in rolled one

setupInput();

function setupInput() {
  window.addEventListener("keydown", handleInput, { once: true });
}

async function handleInput(e) {
  switch (e.key) {
    case "ArrowUp": {
      if (!canMoveUp()) {
        setupInput();
        return;
      }
      await handleMoveUp();
      break;
    }
    case "ArrowDown": {
      if (!canMoveDown()) {
        setupInput();
        return;
      }
      await handleMoveDown();
      break;
    }
    case "ArrowRight": {
      if (!canMoveRight()) {
        setupInput();
        return;
      }
      await handleMoveRight();
      break;
    }
    case "ArrowLeft": {
      if (!canMoveLeft()) {
        setupInput();
        return;
      }
      await handleMoveLeft();
      break;
    }
    default:
      setupInput();
      break;
  }

  grid.cells.forEach((cell) => cell.mergeTiles());
  const newTile = new Tile(gameBoard);
  grid.randomEmptyCell().tile = newTile;

  if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
    newTile.waitForTransition(true).then(() => {
      alert("You lose");
    });
    return;
  }

  setupInput();
}

function handleMoveUp() {
  return slideTiles(grid.cellsByColumn);
}

function handleMoveDown() {
  return slideTiles(grid.cellsByColumn.map((column) => [...column].reverse()));
}

function handleMoveLeft() {
  return slideTiles(grid.cellsByRow);
}

function handleMoveRight() {
  return slideTiles(grid.cellsByRow.map((row) => [...row].reverse()));
}

function slideTiles(cells) {
  return Promise.all(
    cells.flatMap((group) => {
      const promises = [];
      // takes all cells that are in the array 4x4
      for (let i = 1; i < group.length; i++) {
        //i=1, because the first column cant be moved
        const cell = group[i]; //current object from the array is assigned to cell
        if (cell.tile == null) continue;
        let lastValidCell;
        for (let j = i - 1; j >= 0; j--) {
          // takes the oposite site of board and then checks above cells if they are empty, if yes then goes to te last empty one
          const moveToCell = group[j];
          if (!moveToCell.canAccept(cell.tile)) break; //checking if cell above is empty, if not then breaks the loop
          lastValidCell = moveToCell; //if the above cell was empty its assigned to lastValidCell
        }

        if (lastValidCell != null) {
          promises.push(cell.tile.waitForTransition());
          //if lastValidCell isnt empty
          if (lastValidCell.tile != null) {
            // and if there is a tile
            lastValidCell.mergeTile = cell.tile; //then merge these tiles
          } else {
            lastValidCell.tile = cell.tile; //move the tile to next position
          }
          cell.tile = null; //reset the value
        }
      }
      return promises;
    })
  );
}

function canMoveUp() {
  return canMove(grid.cellsByColumn);
}

function canMoveDown() {
  return canMove(grid.cellsByColumn.map((column) => [...column].reverse()));
}

function canMoveLeft() {
  return canMove(grid.cellsByRow);
}

function canMoveRight() {
  return canMove(grid.cellsByColumn.map((row) => [...row].reverse()));
}

function canMove(cells) {
  return cells.some((group) => {
    return group.some((cell, index) => {
      if (index == 0) return false;
      if (cell.tile == null) return false;
      const moveToCell = group[index - 1];
      return moveToCell.canAccept(cell.tile);
    });
  });
}
