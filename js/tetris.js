function Tetris(canvasName, width, height) {
  var paper = Raphael(canvasName, width, height);
  paper.rect(0, 0, width, height).attr({fill: '#e8e8e8'});
  
  new TetrisLogic(new TetrisGraphic(paper, 10, 20));
}