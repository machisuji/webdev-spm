//Raphael paper to act as playground, width and height in number of Blocks
function TetrisGraphic(canvas, xCount, yCount) {
  this.canvas = canvas;
  this.playground = new Playground(canvas, xCount, yCount);

  var blocks = [new Block(0, 5, 7)];
  this.render(blocks);

  this.render = function(blocks) {
    _.each(blocks, function(block) {
      playground.getPoint(block.x, block.y).attr({fill: '#ff0000'});
    });
  }


}

/*
function PlaygroundPoint(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;

  this.fill = function(color) {

  }
}
*/

function Playground(canvas, xCount, yCount) {
  this.canvas = canvas;
  this.xCount = yCount;
  this.pWidth = canvas.width / xCount;
  this.pHeight = canvas.height / yCount;
  this.points = [];

  _.each(_.range(xCount), function(x) {
      points[x] = [];
      _.each(_.range(yCount), function(y) {
        this.points[x][y] = canvas.rect(x * this.pWidth(), y * this.pHeight, this.pWidth, this.pHeight);
      });
  });

  this.getPoint = function(x, y) {
    return this.points[x][y];
  }
}