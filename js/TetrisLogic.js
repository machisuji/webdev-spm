var Empty = {}

function TetrisLogic(graphic) {
  this.graphic = graphic;

  //implement this: create blocks to be rendered by TetrisGraphics
  //this.graphic.render(blocks);

  this.blocks = function() {
    return [];
  };
  this.moveRight = function(){alert("Arrow Right");};
  this.moveLeft = function(){alert("Arrow Left");};
  this.moveDown = function(){alert("Arrow Down");};
  this.setDown = function(){alert("Space");};
  this.rotate = function(){alert("Arrow Up");};

}

function Grid(width, height) {
  this.width = width;
  this.height = height;
  this.blocks = new Array(width);
  for (var x = 0; x < width; ++x) {
    this.blocks[x] = new Array(height);
    for (var y = 0; y < height; ++y) {
      this.blocks[x][y] = Empty;
    }
  }
}

function Piece(neighbours) {
  neighbours = neighbours || {};

  this.top = neighbours.top || Empty;
  this.right = neighbours.right || Empty;
  this.bottom = neighbours.bottom || Empty;
  this.left = neighbours.left || Empty;
  this.angle = 0; // pieces are rotated clockwise by 90 degrees

  var self = this;

  this.outmost = function(next, current) {
    if (current === undefined) return self.outmost(next, self);
    else {
      var piece = next(current)
      if (piece === Empty) return current;
      else return self.outmost(next, piece);
    }
  };

  this.topMost = function() {
    return this.outmost(function(piece) { return piece.top; });
  };

  this.rightMost = function() {
    return this.outmost(function(piece) { return piece.right; });
  };

  this.bottomMost = function() {
    return this.outmost(function(piece) { return piece.bottom; });
  };

  this.leftMost = function() {
    return this.outmost(function(piece) { return piece.left; });
  };
}

Piece.createBar = function createBar(length, orientation, piece, i) {
  length = length || 4;
  piece = piece || new Piece();
  i = i || 1;

  if (i == length) {
    if (orientation === "horizontal") {
      piece.angle = 90;
    }
    piece.rotate = function() {
      if (piece.angle === 90 || piece.angle === 270) {
        return createBar(length, "vertical");
      } else {
        return createBar(length, "horizontal");
      }
    };
    return piece;
  } else {
    if (orientation === "horizontal") {
      piece.rightMost().right = new Piece();
    } else {
      piece.bottomMost().bottom = new Piece();
    }
    return createBar(length, orientation, piece, i + 1);
  }
};

Piece.createTri = function createTri() {
  var piece = new Piece();

  //  #
  // ###
  piece.top = new Piece();
  piece.left = new Piece();
  piece.right = new Piece();

  piece.rotate = function() {
    var piece = new Piece();
    if (piece.angle === 0) {
      // #
      // ##
      // #
      piece.top = new Piece();
      piece.right = new Piece();
      piece.bottom = new Piece();
      piece.angle = 90;
    } else if (piece.angle === 90) {
      // ###
      //  #
      piece.left = new Piece();
      piece.right = new Piece();
      piece.bottom = new Piece();
      piece.angle = 180;
    } else if (piece.angle === 180) {
      //  #
      // ##
      //  #
      piece.top = new Piece();
      piece.left = new Piece();
      piece.bottom = new Piece();
      piece.angle = 270;
    } else if (piece.angle === 270) {
      piece = createTri();
    }

    return piece;
  };

  return piece;
};
