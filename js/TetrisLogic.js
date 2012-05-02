function TetrisLogic(graphic) {
  this.graphic = graphic;

  //implement this: create blocks to be rendered by TetrisGraphics
  //this.graphic.render(blocks);

  this.blocks = function() {
    return [];
  };
}

function Grid(width, height) {
  this.width = width;
  this.height = height;
  this.blocks = new Array(width);
  for (var x = 0; x < width; ++x) {
    this.blocks[x] = new Array(height);
    for (var y = 0; y < height; ++y) {
      this.blocks[x][y] = undefined;
    }
  }
}

function Piece(neighbours) {
  this.top = neighbours.top;
  this.right = neighbours.right;
  this.bottom = neighbours.bottom;
  this.left = neighbours.left;

  var self = this;

  this.topMost = function() {
    var piece = this.top;
    if (piece === undefined) {
      if (this === self) return undefined;
      else return this;
    } else return piece.topMost();
  };
}

window.Pieces = {
  createBar: function(length, orientation, piece, i) {
     if (i == length) return piece;
     else return window.Pieces.createBar(length, orientation,
      piece, i + 1);
  }
}

