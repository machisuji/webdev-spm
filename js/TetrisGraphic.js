//Raphael paper to act as playground, width and height in number of Blocks
function TetrisGraphic(canvasName, canvasRows, canvasColumns, previewName, previewRows, previewColumns) {
  this.colorMap = {0: "img/red.png", 1: "img/yellow.png", 2: "img/green.png", 3: "img/gray.png", 4: "img/purple.png", 5: "img/blue", 6: "img/orange.png"};
  this.blockImgs = [];
  this.canvas = new TetrisWindow(canvasName, canvasRows, canvasColumns);
  this.preview = new TetrisWindow(previewName, previewRows, previewColumns);

  var self = this;

  this.render = function(state) {
    this.renderState(state);
  }

  this.renderState = function(state) {
    self.clear();

    if (state.blocks != null) {
      this.renderBlocks(state.blocks);
    }

    if (state.active != null) {
      this.renderBlocks(state.active);
    }

    if (state.preview != null) {
      this.renderBlocks(state.preview);
    }

  };

  this.renderBlocks = function(blocks) {
    _.each(blocks, function(block) {
      var bbox = self.canvas.points[block.x][block.y].getBBox();
      var img = self.canvas.canvas.image(self.colorMap[block.type], bbox.x+0.5, bbox.y+0.5, bbox.width-1, bbox.height-1);
      self.blockImgs.push(img);
    });
  }

  this.clear = function() {
    //clear blocks in img and preview
    _.each(this.blockImgs, function(img){
      img.remove();
    });
  };

  /*this.createLShape = function(x, y) {
    var blocks = {
      center:       new Block(4, x, y - 1),
      top:          new Block(4, x, y),
      bottom:       new Block(4, x, y + 1),
      bottomRight:  new Block(4, x + 1, y + 1)
    };

    blocks.center.upper = blocks.top;
    blocks.center.lower = blocks.bottom;

    blocks.top.bottom = blocks.center;

    blocks.bottom.top = blocks.center;
    blocks.bottom.right, blocks.bottomRight;

    blocks.bottomRight.left, blocks.bottom;

    return blocks.center;
  };*/

  var state = new TetrisState(
    //blocks
    [
      new Block(3, 0, 19),
      new Block(3, 1, 19),
      new Block(3, 0, 18),
      new Block(3, 1, 18),

      new Block(0, 5, 17),
      new Block(0, 5, 18),
      new Block(0, 4, 18),
      new Block(0, 4, 19),

      new Block(1, 9, 19),
      new Block(1, 9, 18),
      new Block(1, 9, 17),
      new Block(1, 8, 18),

      new Block(2, 5, 19),
      new Block(2, 6, 19),
      new Block(2, 7, 19),
      new Block(2, 8, 19)
    ],

    //active
    [

    ],

    //preview
    [

    ],
    0, 0, 0);

  this.render(state);

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

function TetrisWindow(canvasName, xCount, yCount) {
  var canvasElement = $("#" + canvasName);

  this.canvas = Raphael(canvasName, canvasElement.width(), canvasElement.height());
  this.xCount = xCount;
  this.yCount = yCount;
  this.points = new Array(xCount);

  var pWidth = this.canvas.width / xCount;
  var pHeight = this.canvas.height / yCount;
  var self = this;

  _.each(_.range(self.xCount), function(x) {
      self.points[x] = new Array(self.yCount);
      _.each(_.range(self.yCount), function(y) {
        self.points[x][y] = self.canvas.rect(x * pWidth, y * pHeight, pWidth, pHeight).attr({'fill-opacity': '0.75', 'fill': '#fff'});
      });
  });

  this.getPoint = function(x, y) {
    return this.points[x][y];
  };
}