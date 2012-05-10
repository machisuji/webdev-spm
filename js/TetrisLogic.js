var Empty = {}

function TetrisLogic(width, height) {
  var self = this;

  this.grid = new Grid(width, height);
  this.interval = 1000;
  this.level = 1;
  this.score = 0;

  this.blocks = function() {
    return self.grid.listBlocks();
  };

  this.moveRight = function() { self.move(1, 0) };
  this.moveLeft = function() { self.move(-1, 0) };
  this.moveDown = function() { self.move(0, 1) };
  this.setDown = function(){alert("Space");};
  this.rotate = function() {
    if (self.activePiece) {
      var rotated = self.activePiece.rotate();
      if (!self.collision(rotated)) {
        self.activePiece = rotated;
      }
    }
  };

  this.move = function move(dx, dy) {
    if (self.activePiece) {
      if (!self.collision(self.activePiece, dx, dy)) {
        self.activePiece.x += dx;
        self.activePiece.y += dy;
      } else {
        return false;
      }
    }
    return true;
  }

  this.state = function state() {
    var ret = {
      blocks: self.blocks(),
      level: self.level,
      score: self.score
    };
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
    else if (self.isGameOver()) return false;

    if (self.activePiece.yMax() >= height - 1 ||
        self.collision(self.activePiece, 0, 1, true)) {

      var blocks = self.activePiece.blocks();
      _.each(blocks, function(block) { // Blöcke liegen lassen
        self.grid.setBlockAt(block.x, block.y, {type: block.type});
      });
      var collapsedRows = self.grid.collapse();

      self.score += (self.level * blocks.length) +
        (self.level * self.grid.width * collapsedRows);

      self.spawn();
    } else {
      self.activePiece.y += 1;
    }
    return true;
  };

  this.isGameOver = function checkState() {
    if (self.activePiece) {
      return self.activePiece.yMin() == 0 && self.collision(self.activePiece);
    } else {
      return false;
    }
  };

  this.spawn = function spawn(piece) {
    piece = piece || self.nextPiece || Piece.createRandom();
    self.activePiece = piece;

    self.nextPiece = Piece.createRandom();

    piece.x = width / 2;
    piece.y = Math.max(0, 0 - piece.yMin());
  };

  this.collision = function collision(piece, dx, dy, blocksOnly) {
    dx = dx || 0;
    dy = dy || 0;
    blocksOnly = blocksOnly || false;
    return _.any(piece.blocks(piece.x + dx, piece.y + dy), function(block) {
      if (self.grid.containsPoint(block.x, block.y)) {
        return self.grid.blockAt(block.x, block.y) !== Empty
      } else {
        return !blocksOnly;
      }
    });
  };
}

function Grid(width, height) {
  var self = this;

  this.width = width;
  this.height = height;
  this.blocks = new Array(width);
  for (var y = 0; y < height; ++y) {
    this.blocks[y] = new Array(width);
    for (var x = 0; x < width; ++x) {
      this.blocks[y][x] = Empty;
    }
  }

  this.blockAt = function blockAt(x, y) {
    return self.blocks[y][x];
  };

  this.setBlockAt = function setBlockAt(x, y, block) {
    self.blocks[y][x] = block;
  };

  this.rowAt = function rowAt(y) {
    return self.blocks[y];
  };

  this.rowEmpty = function rowEmpty(y) {
    return _.all(self.rowAt(y), function(block) { return block === Empty });
  };

  this.clearRow = function clearRow(y) {
    var row = self.rowAt(y);
    for (var x = 0; x < self.width; ++x) {
      row[x] = Empty;
    }
  };

  this.containsPoint = function containsPoint(x, y) {
    return x >= 0 && x < self.width && y >= 0 && y < self.height;
  };

  this.listBlocks = function listBlocks() {
    var blocks = [];
    for (var x = 0; x < width; ++x) {
      for (var y = 0; y < height; ++y) {
        var block = self.blocks[y][x];
        if (block !== Empty) {
          blocks.push({x: x, y: y, type: block.type});
        }
      }
    }
    return blocks;
  };

  this.checkCompleteRows = function checkCompleteRows() {
    var i = -1;
    var indices = _.flatten(_.map(self.blocks, function(row) {
      ++i;
      if (_.all(row, function(block) { return block !== Empty })) {
        return [i];
      } else {
        return []
      }
    }));
    return indices;
  };

  this.collapse = function collapse() {
    var crows = self.checkCompleteRows();
    _.each(crows, function(rowIndex) {
      self.clearRow(rowIndex);
    });

    for (var y = self.height - 1; y >= 0; --y) {
      if (!self.rowEmpty(y)) {
        var bottomIndex = _.find(_.range(y + 1, self.height).reverse(), function(index) {
          return self.rowEmpty(index);
        });
        if (bottomIndex !== undefined) {
          var emptyRow = self.blocks[bottomIndex];
          self.blocks[bottomIndex] = self.blocks[y];
          self.blocks[y] = emptyRow;
        }
      }
    }
    return crows.length;
  };
}

function Piece(attr) {
  attr = attr || {};

  this.top = attr.top || Empty;
  this.right = attr.right || Empty;
  this.bottom = attr.bottom || Empty;
  this.left = attr.left || Empty;
  this.angle = attr.angle || 0; // pieces are rotated clockwise by 90 degrees
  this.type = attr.type;
  this.x = attr.x;
  this.y = attr.y;

  var self = this;

  this.blocks = function blocks(rx, ry) {
    if (rx !== 0) {
      rx = rx || self.x || 0;
    }
    if (ry !== 0) {
      ry = ry || self.y || 0;
    }

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

Piece.createRandom = function createRandom() {
  var shapes = [Piece.createBar, Piece.createTri, Piece.createBlock,
                Piece.createL, Piece.createZ];
  var index = Math.floor(Math.random() * shapes.length);
  return shapes[index]();
}

Piece.createBar = function createBar(length, orientation, piece, i) {
  length = length || 4;
  piece = piece || new Piece();
  i = i || 1;

  if (i == length) {
    if (orientation === "horizontal") {
      piece.angle = 90;
    }
    piece.rotate = function rotate() {
      var bar = undefined;
      if (piece.angle === 90 || piece.angle === 270) {
        bar = createBar(length, "vertical");
      } else {
        bar = createBar(length, "horizontal");
      }
      bar.x = piece.x;
      bar.y = piece.y;

      return bar;
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

Piece.createTri = function createTri(angle) {
  var piece = new Piece({angle: angle || 0});
  var alpha = piece.angle % 360;

  if (alpha === 90) {
    // #
    // ##
    // #
    piece.top = new Piece();
    piece.right = new Piece();
    piece.bottom = new Piece();
  } else if (alpha === 180) {
    // ###
    //  #
    piece.left = new Piece();
    piece.right = new Piece();
    piece.bottom = new Piece();
  } else if (alpha === 270) {
    //  #
    // ##
    //  #
    piece.top = new Piece();
    piece.left = new Piece();
    piece.bottom = new Piece();
  } else if (alpha === 0) {
    //  #
    // ###
    piece.top = new Piece();
    piece.left = new Piece();
    piece.right = new Piece();
  }

  piece.rotate = function rotate() {
    var rotated = createTri(piece.angle + 90);
    rotated.x = piece.x;
    rotated.y = piece.y;

    return rotated;
  };

  piece.setType(1);

  return piece;
};

Piece.createBlock = function createBlock() {
  var piece = new Piece();
  piece.right = new Piece();
  piece.right.bottom = new Piece();
  piece.bottom = new Piece();

  piece.rotate = function rotate() {
    return piece;
  };
  piece.setType(2);

  return piece;
};

Piece.createL = function createL(angle) {
  var l = new Piece({angle: angle || 0});
  var alpha = l.angle % 360;

  if (alpha == 0) {
    l.bottom = new Piece();
    l.bottom.bottom = new Piece();
    l.bottom.bottom.right = new Piece();
  } else if (alpha == 90) {
    l.bottom = new Piece();
    l.right = new Piece();
    l.right.right = new Piece();
  } else if (alpha == 180) {
    l.left = new Piece();
    l.bottom = new Piece();
    l.bottom.bottom = new Piece();
  } else if (alpha == 270) {
    l.right = new Piece();
    l.right.right = new Piece();
    l.right.right.top = new Piece();
  }

  l.rotate = function rotate() {
    var rotated = createL(l.angle + 90);
    rotated.x = l.x;
    rotated.y = l.y;

    return rotated;
  };
  l.setType(3);

  return l;
};

Piece.createZ = function createZ(angle) {
  var z = new Piece({angle: angle || 0});
  var alpha = z.angle % 360;

  if (alpha == 0) {
    z.left = new Piece();
    z.top = new Piece();
    z.top.right = new Piece();
  } else if (alpha == 90) {
    z.top = new Piece();
    z.right = new Piece(),
    z.right.bottom = new Piece();
  } else if (alpha == 180) {
    z.right = new Piece();
    z.bottom = new Piece();
    z.bottom.left = new Piece();
  } else if (alpha == 270) {
    z.top = new Piece();
    z.left = new Piece();
    z.left.bottom = new Piece();
  }

  z.rotate = function rotate() {
    var rotated = createZ(z.angle + 90);
    rotated.x = z.x;
    rotated.y = z.y;

    return rotated;
  };
  z.setType(4);

  return z;
}
