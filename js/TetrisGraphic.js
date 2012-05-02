//Raphael paper to act as playground, width and height in number of Blocks
function TetrisGraphic(canvas, xCount, yCount) {
  this.canvas = canvas;
  this.playground = new Playground(canvas, xCount, yCount);

  var blocks = [new Block(0, 5, 7)];


  this.render = function(playground, blocks) {
    _.each(blocks, function(block) {
      playground.getPoint(block.x, block.y).attr({fill: '#ff0000'});
    });
  }

  this.render(this.playground, blocks);


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
  this.xCount = xCount;
  this.yCount = yCount;
  var pWidth = canvas.width / xCount;
  var pHeight = canvas.height / yCount;
  var points = new Array(xCount);


  _.each(_.range(xCount), function(x) {
      points[x] = new Array(yCount);
      _.each(_.range(yCount), function(y) {
        points[x][y] = canvas.rect(x * pWidth, y * pHeight, pWidth, pHeight);
      });
  });

  this.points = points;

  this.getPoint = function(x, y) {
    return this.points[x][y];
  }
}