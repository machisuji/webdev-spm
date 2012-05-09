//Raphael paper to act as playground, width and height in number of Blocks
function TetrisGraphic(canvasName, canvasRows, canvasColumns, previewName, previewRows, previewColumns) {
  this.colorMap = {0: "img/red.png", 1: "img/yellow.png", 2: "img/green.png", 3: "img/gray.png", 4: "img/purple.png", 5: "img/blue", 6: "img/orange.png"};
  this.blockSet = undefined;
  this.colorMap = {0: "img/red.png", 1: "img/yellow.png", 2: "img/green.png", 3: "img/gray.png", 4: "img/purple.png", 5: "img/blue.png", 6: "img/orange.png"};
  this.canvas = new TetrisWindow(canvasName, canvasRows, canvasColumns);
  this.preview = new TetrisWindow(previewName, previewRows, previewColumns);

  var self = this;

  this.render = function(state) {
    this.highlightLines(state.clearedLines);
    this.renderState(state);
    this.renderScore(state.score);
  }

  this.renderState = function(state) {
    self.canvas.canvas.setStart();

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

    self.blockSet = self.canvas.canvas.setFinish();
  };

  this.renderBlocks = function(blocks) {
    _.each(blocks, function(block) {
      var bbox = self.canvas.points[block.x][block.y].getBBox();
      //self.blockSet = self.canvas.canvas.set();
      self.canvas.canvas.image(self.colorMap[block.type], bbox.x+0.5, bbox.y+0.5, bbox.width-1, bbox.height-1);
      //self.blockSet.push(img);
    });
  }

  this.renderPreview = function(blocks) {}

  this.highlightLines = function(lines) {
    var hightlightSet = self.canvas.canvas.set();

    _.each(lines, function(interval){
      var startRect = self.canvas.getPoint(0, interval[0]).getBBox();
      var endRect   = self.canvas.getPoint(self.canvas.xCount - 1, interval[1]).getBBox();
      hightlightSet.push(self.canvas.canvas.rect(startRect.x, startRect.y, endRect.x2 - startRect.x, endRect.y2 - startRect.y).glow({fill: true, color: "#fff"}));
    })

    var anim = Raphael.animation({opacity: 0.0}, 300, "linear", function(evt) {
      hightlightSet.remove();
    });
    hightlightSet.animate(anim.repeat(3));
  }

  this.renderScore = function(score) {
    var str = score.toString();
    var missingLeadingZeros = 4 - str.length;
    _.each(_.range(missingLeadingZeros), function() {
        str = "0" + str;
    });

    var child = $('#score').children().first();
    for (var i in str) {
      var char = str[i];
      //var newClass = this.newScoreClassName(char);

      var newClassName = this.newScoreClassName(char);
      var currentClassName = this.currentScoreClassName(child);

      if (newClassName != currentClassName)
        child.switchClass(currentClassName, newClassName, 750, 'easeOutBounce');

      //child.removeClass("zero one two third four five six seven eight nine").addClass(newClass);
      child = child.next();
    }
  }

  this.newScoreClassName = function(num) {
    switch(num) {
      case "0": return "zero";
      case "1": return "one";
      case "2": return "two";
      case "3": return "three";
      case "4": return "four";
      case "5": return "five";
      case "6": return "six";
      case "7": return "seven";
      case "8": return "eight";
      case "9": return "nine";
    }
  }

  this.currentScoreClassName = function(e) {
    if (e.hasClass("zero"))
      return "zero";

    if (e.hasClass("one"))
      return "one";

    if (e.hasClass("two"))
      return "two";

    if (e.hasClass("three"))
      return "three";

    if (e.hasClass("four"))
      return "four";

    if (e.hasClass("five"))
      return "five";

    if (e.hasClass("six"))
      return "six";

    if (e.hasClass("seven"))
      return "seven";

    if (e.hasClass("eight"))
      return "eight";

    if (e.hasClass("nine"))
      return "nine";
  }

  this.clear = function() {
    //removes old blocks from canvas, preview
    if(this.blockSet != undefined){
      this.blockSet.remove();
    }
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
    [[18, 19]], 0, 567);

  this.render(state);

}

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