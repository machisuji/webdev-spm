var Empty = {}

function TetrisLogic(width, height) {
  var self = this;

  this.grid = new Grid(width, height);
  this.interval = 1000;

  this.blocks = function() {
    return self.grid.listBlocks();
  };

  this.moveRight = function(){alert("Arrow Right");};
  this.moveLeft = function(){alert("Arrow Left");};
  this.moveDown = function(){alert("Arrow Down");};
  this.setDown = function(){alert("Space");};
  this.rotate = function(){alert("Arrow Up");};

  this.state = function state() {
    var ret = {blocks: self.blocks()};
    if (self.activePiece) {
      ret.active = self.activePiece.blocks();
    }
    if (self.nextPiece) {
      ret.preview = self.nextPiece.blocks();
    }

    return ret;
  };

  this.nextRound = function nextRound() {
    if (!self.activePiece) return true;
    else if (!self.checkState()) return false;

    self.activePiece.y += 1;
    if (self.activePiece.yMax() > height - 1 ||
        self.collision(self.activePiece)) {

      self.activePiece.y -= 1;

      var blocks = self.activePiece.blocks();
      _.each(blocks, function(block) { // Blöcke liegen lassen
        self.grid.blocks[block.x][block.y] = {type: block.type};
      });
      self.spawn(Piece.createTri());
    }
    return true;
  };

  this.checkState = function checkState() {
    if (!self.activePiece) {
      if (self.activePiece.yMin() == 0 && self.collision(self.activePiece)) {
        return false;
      }
    }
    return true;
  };

  this.spawn = function spawn(piece) {
    self.activePiece = piece;
    piece.x = width / 2;
    piece.y = Math.max(0, 0 - piece.yMin());
  };

  this.collision = function collision(piece) {
    return _.any(piece.blocks(), function(block) {
      return self.grid.blocks[block.x][block.y] !== Empty
    });
  };
}

function Grid(width, height) {
  var self = this;

  this.width = width;
  this.height = height;
  this.blocks = new Array(width);
  for (var x = 0; x < width; ++x) {
    this.blocks[x] = new Array(height);
    for (var y = 0; y < height; ++y) {
      this.blocks[x][y] = Empty;
    }
  }

  this.listBlocks = function listBlocks() {
    var blocks = [];
    for (var x = 0; x < width; ++x) {
      for (var y = 0; y < height; ++y) {
        var block = self.blocks[x][y];
        if (block !== Empty) {
          blocks.push({x: x, y: y, type: block.type});
        }
      }
    }
    return blocks;
  };
}

function Piece(attr) {
  attr = attr || {};

  this.top = attr.top || Empty;
  this.right = attr.right || Empty;
  this.bottom = attr.bottom || Empty;
  this.left = attr.left || Empty;
  this.angle = 0; // pieces are rotated clockwise by 90 degrees
  this.type = attr.type;

  var self = this;

  this.blocks = function blocks(rx, ry) {
    rx = rx || self.x || 0;
    ry = ry || self.y || 0;

    var neighbours = _.zip(
      [{x: 0, y: -1}, {x: 1, y: 0}, {x: 0, y: 1}, {x: -1, y: 0}],
      [self.top,      self.right,   self.bottom,  self.left   ]);
    var blocks = _.map(neighbours, function(neighbour) {
      var rc = neighbour[0];
      var piece = neighbour[1];
      if (piece !== Empty) {
        return piece.blocks(rx + rc.x, ry + rc.y);
      } else {
        return [];
      }
    });
    blocks.splice(0, 0, [{x: rx, y: ry, type: self.type}]);

    return _.flatten(blocks);
  };

  this.dimension = function width(criterion) {
    var blocks = self.blocks();
    var min = _.min(blocks, criterion);
    var max = _.max(blocks, criterion);

    return Math.abs(max - min);
  };

  this.width = function width() {
    return self.dimension(function(block) { return block.y });
  };

  this.height = function height() {
    return self.dimension(function(block) { return block.x });
  };

  this.xMin = function xMin() {
    return _.min(self.blocks(), function(block) { return block.x }).x;
  };

  this.xMax = function xMin() {
    return _.max(self.blocks(), function(block) { return block.x }).x;
  };

  this.yMin = function xMin() {
    return _.min(self.blocks(), function(block) { return block.y }).y;
  };

  this.yMax = function xMin() {
    return _.max(self.blocks(), function(block) { return block.y }).y;
  };

  this.setType = function setType(type) {
    self.type = type;
    _.each([self.top, self.right, self.bottom, self.left], function(piece) {
      if (piece !== Empty) {
        piece.setType(type);
      }
    });
  };

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
    piece.setType(0);

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

  piece.setType(1);

  return piece;
};
