//Raphael paper to act as playground, width and height in number of Blocks
function TetrisGraphic(canvasRows, canvasColumns, fieldId) {
  this.blockSet = undefined;
  this.colorMap =
  {
    "level_0": {
      0: "img/red.png", 1: "img/yellow.png", 2: "img/green.png", 3: "img/gray.png", 4: "img/purple.png", 5: "img/blue.png", 6: "img/orange.png"
    },
    "level_1": {
      0: "img/yellow.png", 1: "img/green.png", 2: "img/gray.png", 3: "img/purple.png", 4: "img/blue.png", 5: "img/orange.png", 6: "img/red.png"
    },
    "level_1": {
      0: "img/green.png", 1: "img/gray.png", 2: "img/purple.png", 3: "img/blue.png", 4: "img/orange.png", 5: "img/red.png", 6: "img/yellow.png"
    },
    "level_2": {
      0: "img/gray.png", 1: "img/purple.png", 2: "img/blue.png", 3: "img/orange.png", 4: "img/red.png", 5: "img/yellow.png", 6: "img/green.png"
    },
    "level_3": {
      0: "img/purple.png", 1: "img/blue.png", 2: "img/orange.png", 3: "img/red.png", 4: "img/yellow.png", 5: "img/green.png", 6: "img/gray.png"
    },
    "level_4": {
      0: "img/blue.png", 1: "img/orange.png", 2: "img/red.png", 3: "img/yellow.png", 4: "img/green.png", 5: "img/gray.png", 6: "img/purple.png"
    },
    "level_5": {
      0: "img/orange.png", 1: "img/red.png", 2: "img/yellow.png", 3: "img/green.png", 4: "img/gray.png", 5: "img/purple.png", 6: "img/blue.png"
    }
  };
  this.fieldId = fieldId;
  this.canvasName = fieldId + "_canvas";
  this.canvas = new TetrisWindow(this.canvasName, canvasRows, canvasColumns);
  this.previewName = fieldId + "_preview";
  this.preview = null;
  this.currentTheme = "level_0";

  var self = this;


  this.render = function(state) {
    //this.highlightLines(state.clearedLines);
    this.renderState(state);
    this.renderPanel("#" + fieldId + " .scores", state.score);
    this.renderPanel("#" + fieldId + " .lines", state.clearedLinesTotal);
    this.renderPanel("#" + fieldId + " .level", state.level);
    this.switchLevelTheme(state.level);

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
      self.canvas.canvas.image(self.colorMap[self.currentTheme][block.type], bbox.x+0.5, bbox.y+0.5, bbox.width-1, bbox.height-1);
      //self.blockSet.push(img);
    });
  }

  this.renderPreview = function(blocks) {
    if (this.preview != null) {
      $('#' + this.previewName + ' svg').remove();
    }

    var minX;
    var maxX;
    var minY;
    var maxY;

    _.each(blocks, function(b) {
      if (minX == null || b.x < minX)
        minX = b.x;

      if (maxX == null || b.x > maxX)
        maxX = b.x;

      if (minY == null || b.y < minY)
        minY = b.y;

      if (maxY == null || b.y > maxY)
        maxY = b.y;
    });
    var width = maxX - minX + 1;
    var height = maxY - minY + 1;
    var pWidth = this.canvas.pWidth;
    var pHeight = this.canvas.pHeight;

    this.preview = Raphael(this.previewName, width * pWidth, height * pHeight);
    var self = this;

    _.each(blocks, function(b) {
      var x = (b.x - minX) * pWidth;
      var y = (b.y - minY) * pHeight;
      self.preview.image(self.colorMap[self.currentTheme][b.type], x, y, pWidth, pHeight);
    });

    var previewElement = $('#' + this.previewName + ' svg');
    var previewCssLeft = (previewElement.parent().width() - (width * pWidth)) / 2;
    var previewCssTop = (previewElement.parent().height() - (height * pHeight)) / 2;

    previewElement.css({"left": previewCssLeft.toString() + "px", "top": previewCssTop.toString() + "px"});
  }

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

  this.renderPanel = function(name, val) {
    var str = val.toString();
    var container = $(name);
    var childrenCount = container.children().length - 1;
    var missingLeadingZeros = childrenCount - str.length;
    _.each(_.range(missingLeadingZeros), function() {
        str = "0" + str;
    });

    var child = container.children().first().next();
    _.each(_.range(childrenCount), function(i) {
      var char = str[i];
      //var newClass = self.newPanelClassName(char);
      var newClassName = self.newPanelClassName(char);
      var currentClassName = self.currentPanelClassName(child);

      if (newClassName != currentClassName)
        child.switchClass(currentClassName, newClassName, 1000, 'easeOutBounce');

      //child.removeClass("zero one two third four five six seven eight nine").addClass(newClass);
      child = child.next();
    });
  }

  this.newPanelClassName = function(num) {
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

  this.currentPanelClassName = function(e) {
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

  this.switchLevelTheme = function(level) {
    var newTheme = "level_" + level.toString();
    if (newTheme != this.currentTheme) {
      $("#" + this.fieldId + " ." + this.currentTheme).switchClass(this.currentTheme, newTheme, 1000);

      this.currentTheme = newTheme;
    }
  }

}

function TetrisWindow(canvasName, xCount, yCount) {
  var canvasElement = $("#"+canvasName);

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