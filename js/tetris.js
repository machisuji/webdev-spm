
function Tetris() {
  this.player1 = new Player("Player 1", "player1", 0);
  this.player2 = new Player("Player 2", "player2", 1);

  this.controls = new Controls(this.logic, this.graphics, [this.player1, this.player2]);

  var self = this;
  var mainLoop = function mainLoop(player) {
    if (player.logic.nextRound()) {
      player.graphics.render(player.logic.state());
      setTimeout(function(){mainLoop(player)}, player.logic.interval);
    } else {
      alert(player.name + " is\nGame Over");
    }
  };
  var start = function start(players) {
    _.each(players, function(player) {
      player.logic.spawn();
      player.graphics.render(player.logic.state());
      setTimeout(function() { mainLoop(player) }, 1000);
    });
  };
  setTimeout(function() {
      start(self.player1);
      start(self.player2);
    }, 2000);
}

function Player(name, fieldId, nr) {
  this.logic = new TetrisLogic(10, 20);
  this.graphics = new TetrisGraphic(10, 20, fieldId);
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