function Tetris(canvasName, width, height) {
  var paper = Raphael(canvasName, width, height);
  paper.rect(0, 0, width, height).attr({fill: '#e8e8e8'});
  new TetrisLogic(new TetrisGraphic(paper, 10, 20));
}


//x,y are int positions, type is an int specifying the color of the block
function Block(type, x, y) {
  this.x = x;
  this.y = y;
  this.type = type;
}