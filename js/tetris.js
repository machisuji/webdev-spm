function Tetris(canvasName) {
  var paper = Raphael(canvasName, 300, 600);
  new Controls(new TetrisLogic(new TetrisGraphic(paper, 10, 20)));

}


//x,y are int positions, type is an int specifying the color of the block
function Block(type, x, y) {
  this.x = x;
  this.y = y;
  this.type = type;
}