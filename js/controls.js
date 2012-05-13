function Controls(logic, graphics, players) {
  this.logic = logic;
  this.graphics = graphics;
  this.players = players;

  var self = this;

  this.actions = {
    setDown: {
      codes: [32, 121], // space, Y
      apply: function(index) { players[index].logic.setDown(); }
    },
    moveLeft: {
      codes: [37, 97], // left arrow, A
      apply: function(index) { players[index].logic.moveLeft(); }
    },
    moveRight: {
      codes: [39, 100], // right arrow, D
      apply: function(index) { players[index].logic.moveRight(); }
    },
    moveDown: {
      codes: [40, 115], // arrow down, S
      apply: function(index) { players[index].logic.moveDown(); }
    },
    rotate: {
      codes: [38, 119], // arrow up, W
      apply: function(index) { players[index].logic.rotate(); }
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
          players[index].graphics.renderState(players[index].logic.state());
        }, 0);
    }
   };
  });
}
