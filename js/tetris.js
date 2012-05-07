
function Tetris(canvasName, previewName) {
  new Controls(new TetrisLogic(new TetrisGraphic(canvasName, 10, 20, previewName, 4, 4)));
}

//x,y are int positions, type is an int specifying the color of the block
function Block(type, x, y) {
  this.x = x;
  this.y = y;
  this.type = type;
  this.upper = null;
  this.left = null;
  this.lower = null;
  this.right = null;
}

function TetrisState(blocks, active, preview, clearedLines, clearedLinesTotal, score) {
  this.blocks = blocks;
  this.active = active;
  this.preview = preview;
  this.clearedLines = clearedLines;
  this.clearedLinesTotal = clearedLinesTotal;
  this.score = score;
}