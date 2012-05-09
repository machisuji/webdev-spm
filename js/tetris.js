
function Tetris(canvasName, previewName) {
  new Controls(new TetrisLogic(new TetrisGraphic(canvasName, 10, 20, previewName, 4, 4)));
}

//x,y are int positions, type is an int specifying the color of the block
function Block(type, x, y) {
  this.x = x;
  this.y = y;
  this.type = type;
}

function TetrisState(blocks, active, preview, clearedLines, clearedLinesTotal, score) {
  this.blocks = blocks; //fallen blocks (array of blocks)
  this.active = active; //currently falling piece (array of blocks)
  this.preview = preview; //next piece to come (array of blocks)
  this.clearedLines = clearedLines; //y-indeces of cleared lines since last state update (array of int)
  this.clearedLinesTotal = clearedLinesTotal; //number of totally cleared lines (int)
  this.score = score; //score (int)
}