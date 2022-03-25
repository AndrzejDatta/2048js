const CELL_WIDTH = 20;
const GRID_GAP = 1;
const GRID_SIZE = 4;

export default class Grid {
  #cells;
  constructor(gridElement) {
    gridElement.style.setProperty("--cell-width", `${CELL_WIDTH}vmin`);
    gridElement.style.setProperty("--grid-gap", `${GRID_GAP}vmin`);
    gridElement.style.setProperty("--grid-size", GRID_SIZE);
    this.#cells = createCell(gridElement).map(
      (cellElement, index) =>
        new Cell(cellElement, index % GRID_SIZE, Math.floor(index / GRID_SIZE))
    );
  }

  get cells() {
    return this.#cells;
  }

  get cellsByColumn() {
    return this.#cells.reduce((cellGrid, cell) => {
      cellGrid[cell.x] = cellGrid[cell.x] || [];
      //takes cell.x, if cell.x == 0, then creates new empty array in initial array, else equals itself
      cellGrid[cell.x][cell.y] = cell;
      //cellGrid[cell.x] is number of the array inside the initial array, then cell.y is the number of an object inside the array, by equaling it to cell, its assigning it to the initial array
      return cellGrid;
    }, []);
  }

  get cellsByRow() {
    return this.#cells.reduce((cellGrid, cell) => {
      cellGrid[cell.y] = cellGrid[cell.y] || [];
      //takes cell.x, if cell.x == 0, then creates new empty array in initial array, else equals itself
      cellGrid[cell.y][cell.x] = cell;
      //cellGrid[cell.x] is number of the array inside the initial array, then cell.y is the number of an object inside the array, by equaling it to cell, its assigning it to the initial array
      return cellGrid;
    }, []);
  }

  get #emptyCells() {
    return this.#cells.filter((cell) => cell.tile == null);
    //takes all cells that doesnt have tails on it
  }

  randomEmptyCell = () => {
    const randomCellIndex = Math.floor(Math.random() * this.#emptyCells.length); //
    return this.#emptyCells[randomCellIndex];
    //returns one of empty cells given by emptyCell()
  };
}

class Cell {
  #cellElement;
  #x;
  #y;
  #tile;
  #mergeTile;

  constructor(cellElement, x, y) {
    this.#cellElement = cellElement;
    this.#x = x;
    this.#y = y;
  }

  get x() {
    return this.#x;
  }

  get y() {
    return this.#y;
  }

  get tile() {
    return this.#tile;
    //return tile to check its own x and y to prevent from getting two tails on one cell
  }

  set tile(value) {
    this.#tile = value;
    if (value == null) return;
    this.#tile.x = this.#x; //runs method set x from tile.js
    this.#tile.y = this.#y;
  }

  get mergeTile() {
    return this.#mergeTile;
  }

  set mergeTile(value) {
    this.#mergeTile = value;
    if (value == null) return;
    this.#mergeTile.x = this.#x;
    this.#mergeTile.y = this.#y;
  }

  canAccept(tile) {
    return (
      this.tile == null ||
      (this.mergeTile == null && this.tile.value === tile.value)
    );
  }

  mergeTiles() {
    if (this.tile == null || this.mergeTile == null) return;
    this.tile.value = this.tile.value + this.tile.value;
    this.mergeTile.remove();
    this.mergeTile = null;
  }
}

function createCell(gridElement) {
  let cells = [];
  for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
    let cell = document.createElement("div");
    cell.classList.add("cell");
    cells.push(cell);
    gridElement.append(cell);
  }
  return cells;
}
