//Raphael paper to act as playground, width and height in number of Blocks
function TetrisGraphic(canvasName, canvasRows, canvasColumns, previewName, previewRows, previewColumns) {
  this.colorMap = {0: "img/red.png", 1: "img/yellow.png", 2: "img/green.png", 3: "img/gray.png", 4: "img/purple.png", 5: "img/blue", 6: "img/orange.png"};
  this.blockImgs = [];
  this.canvas = new TetrisWindow(canvasName, canvasRows, canvasColumns);
  this.preview = new TetrisWindow(previewName, previewRows, previewColumns);

  var self = this;

  this.render = function(state) {
    var num = 1;
    for (i = 0; i < state.clearedLines.length; i++) {
      if (i < state.clearedLines.length - 1 && state.clearedLines[i] + 1 == state.clearedLines[i + 1]) {
        num++;
        continue;
      }

      self.highlightLines(state.clearedLines[i - (num - 1)], num);
      num = 1;
    }

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
      this.renderPreview(state.preview);
    }

  };

  this.renderBlocks = function(blocks) {
    _.each(blocks, function(block) {
      var bbox = self.canvas.points[block.x][block.y].getBBox();
      var img = self.canvas.canvas.image(self.colorMap[block.type], bbox.x+0.5, bbox.y+0.5, bbox.width-1, bbox.height-1);
      self.blockImgs.push(img);
    });
  }

  this.renderPreview = function(blocks) {}

  this.highlightLines = function(y, num) {
    var startRect = this.canvas.getPoint(0, y).getBBox();
    var endRect = this.canvas.getPoint(this.canvas.xCount - 1, y + num - 1).getBBox();
    var rect = this.canvas.canvas.rect(startRect.x, startRect.y, endRect.x2, endRect.y2 - endRect.y).glow({fill: true, color: "#fff"});

    var anim = Raphael.animation({opacity: 0.0}, 300, "linear", function() {
      rect.remove();
      self.renderState(state);
    });

    rect.animate(anim.repeat(3));
  }



  this.clear = function() {
    //clear blocks in img and preview
    _.each(this.blockImgs, function(img){
      img.remove();
    });
  };

  var state = new TetrisState(
    //blocks
    [
      //#
      //#
      //##
      new Block(0, 0, 17),
      new Block(0, 0, 18),
      new Block(0, 0, 19),
      new Block(0, 1, 19),

      // #
      // #
      //##
      new Block(1, 2, 15),
      new Block(1, 2, 16),
      new Block(1, 2, 17),
      new Block(1, 1, 17),

      //##
      // ##
      new Block(2, 1, 18),
      new Block(2, 2, 18),
      new Block(2, 2, 19),
      new Block(2, 3, 19),

      // ##
      //##
      new Block(3, 4, 19),
      new Block(3, 5, 19),
      new Block(3, 5, 18),
      new Block(3, 6, 18),

      //##
      //##
      new Block(4, 3, 17),
      new Block(4, 3, 18),
      new Block(4, 4, 17),
      new Block(4, 4, 18),

      //#
      //#
      //#
      //#
      new Block(5, 9, 16),
      new Block(5, 9, 17),
      new Block(5, 9, 18),
      new Block(5, 9, 19),

      // #
      //###
      new Block(6, 7, 18),
      new Block(6, 6, 19),
      new Block(6, 7, 19),
      new Block(6, 8, 19)
    ],

    //active
    [

    ],

    //preview
    [

    ],
    [18, 19], 0, 0);


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

  this.pWidth = this.canvas.width / xCount;
  this.pHeight = this.canvas.height / yCount;
  var self = this;

  _.each(_.range(self.xCount), function(x) {
      self.points[x] = new Array(self.yCount);
      _.each(_.range(self.yCount), function(y) {
        self.points[x][y] = self.canvas.rect(x * self.pWidth, y * self.pHeight, self.pWidth, self.pHeight).attr({"stroke-opacity": 0.3, 'fill-opacity': '0.75', 'fill': '#fff'});
      });
  });

  this.getPoint = function(x, y) {
    return this.points[x][y];
  };
}