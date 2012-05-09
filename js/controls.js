function Controls(logic, graphics) {
  this.logic = logic;
  this.graphics = graphics;

  var self = this;

  this.actions = {
    setDown: {
      codes: [32], // space
      apply: function() { self.logic.setDown(); }
    },
    moveLeft: {
      codes: [37, 97], // left arrow, A
      apply: function() { self.logic.moveLeft(); }
    },
    moveRight: {
      codes: [39, 100], // right arrow, D
      apply: function() { self.logic.moveRight(); }
    },
    moveDown: {
      codes: [40, 115], // arrow down, S
      apply: function() { self.logic.moveDown(); }
    },
    rotate: {
      codes: [38, 119], // arrow up, W
      apply: function() { self.logic.rotate(); }
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
      self.graphics.renderState(self.logic.state());
      action.apply();
    }
   };
  });
}
