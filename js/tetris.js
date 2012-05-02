function init() {
  var paper = Raphael("canvas", 100, 100);
  paper.rect(10, 10, 10, 10).attr({fill: '#e8e8e8'});
  
}


//x,y are int positions, type is an int specifying the color of the block
function Block(type, x, y) {
  this.x = x;
  this.y = y;
  this.type = type;
}