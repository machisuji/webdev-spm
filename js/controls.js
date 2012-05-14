function Controls(logic, graphics, players) {
  this.logic = logic;
  this.graphics = graphics;
  this.players = players;

  var self = this;
  var playerAt = function(index) {
    return self.players[index];
  }

  if (players.length == 1) { // control however you want
    playerAt = function(index) {
      return self.players[0];
    };
  };

  this.actions = {
    setDown: {
      codes: [121, 32], // Y, space
      apply: function(index) { playerAt(index).logic.setDown(); }
    },
    moveLeft: {
      codes: [97, 37], // A, left arrow
      apply: function(index) { playerAt(index).logic.moveLeft(); }
    },
    moveRight: {
      codes: [100, 39], // D, right arrow
      apply: function(index) { playerAt(index).logic.moveRight(); }
    },
    moveDown: {
      codes: [115, 40], // S arrow down
      apply: function(index) { playerAt(index).logic.moveDown(); }
    },
    rotate: {
      codes: [119, 38], // W, arrow up
      apply: function(index) { playerAt(index).logic.rotate(); }
    }
  };

  $(document).ready(function() {
   document.onkeypress = function(e){
    var e = window.event || e;
    var key = e.charCode === 0 ? e.keyCode : e.charCode;

    var action = _.find(self.actions, function(a) {
      return _.include(a.codes, key);
    });
    if (action) {
      e.preventDefault();
      var index = action.codes.indexOf(key);
      action.apply(index);
      setTimeout(function() {
          playerAt(index).graphics.renderState(playerAt(index).logic.state());
        }, 0);
    }
   };
  });
}
