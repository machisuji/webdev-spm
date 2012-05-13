
function Tetris(players) {
  this.players = players;
  this.controls = new Controls(this.logic, this.graphics, this.players);
  this.gameOver = false;
  var self = this;

  var mainLoop = function mainLoop(player) {
    if (player.logic.nextRound()) {
      player.graphics.render(player.logic.state());
      if (!self.gameOver) {
        setTimeout(function(){mainLoop(player)}, player.logic.interval);
      }
    } else {
      self.gameOver = true;
      if (self.players.length > 1) {
        alert("Game Over\n" + player.name + ": you lose. Buahaha!");
      } else {
        alert("Game Over");
      }
      // at this point you could reset the graphics and show the menu again
      // dunno how to reset the graphics though
    }
  };
  this.start = function start() {
    _.each(self.players, function(player) {
      player.logic.spawn();
      player.graphics.render(player.logic.state());
      setTimeout(function() { mainLoop(player) }, 0);
    });
  };
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

$(document).ready(function() {
  $("#start-one-player").click(function() {
    $("#menu").hide();
    $("#player1").show();

    tetris = new Tetris([new Player("Player 1", "player1", 0)]);
    setTimeout(tetris.start, 0);
  });

  $("#start-two-players").click(function() {
    $("#menu").hide();
    $("#player1").show();
    $("#player2").show();

    tetris = new Tetris([new Player("Player 1", "player1", 0),
      new Player("Player 2", "player2", 1)]);
    setTimeout(tetris.start, 0);
  });
});