function Controls(logic) {
  this.logic = logic;
  var self = this;

  $(document).ready(function() {
   document.onkeypress = function(e){
    var e=window.event || e;
    var key = e.charCode === 0 ? e.keyCode : e.charCode;

    switch(key) {
      case 32: //Space
      e.preventDefault();
      self.logic.setDown();
      break;

      case 37: //Arrow left
      e.preventDefault();
      self.logic.moveLeft();
      break;

      case 38: //Arrow up
      e.preventDefault();
      self.logic.rotate();
      break;

      case 39: //Arrow right
      e.preventDefault();
      self.logic.moveRight();
      break;

      case 40: //Arrow down
      e.preventDefault();
      self.logic.moveDown();
      break;
    }
   };
  });
}
