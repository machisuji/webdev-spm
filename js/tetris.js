
function Tetris() {
  this.player1 = new Player("Player 1", "player1");
  this.player2 = new Player("Player 2", "player2");

  var self = this;
  var mainLoop = function mainLoop(player) {
    if (player.logic.nextRound()) {
      player.graphics.render(player.logic.state());
      setTimeout(function(){mainLoop(player)}, player.logic.interval);
    } else {
      alert(player.name + " is\nGame Over");
    }
  };
  setTimeout(function() {
      self.player1.logic.spawn();
      self.player1.graphics.render(self.player1.logic.state());
      setTimeout(function(){mainLoop(self.player1)}, 1000);
    }, 2000);
}

function Player(name, fieldId) {
  this.logic = new TetrisLogic(10, 20);
  this.graphics = new TetrisGraphic(10, 20, fieldId);
  this.controls = new Controls(this.logic, this.graphics);
  this.name = name;
}

//x,y are int positions, type is an int specifying the color of the block
function Block(type, x, y) {
  this.x = x;
  this.y = y;
  this.type = type;
}

function TetrisState(blocks, active, preview, clearedLines, clearedLinesTotal, score, level) {
  this.blocks = blocks; //fallen blocks (array of blocks)
  this.active = active; //currently falling piece (array of blocks)
  this.preview = preview; //next piece to come (array of blocks)
  this.clearedLines = clearedLines; //intervals of y-indeces of cleared lines since last state update (array of array of int; with start and end value)
  this.clearedLinesTotal = clearedLinesTotal; //number of totally cleared lines (int)
  this.score = score; //score (int)
  this.level = level; //current level (int)
}