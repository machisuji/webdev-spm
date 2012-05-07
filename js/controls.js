
$(document).ready(
  document.onkeypress=function(e){
    var e=window.event || e;

    var key = e.charCode === 0 ? e.keyCode : e.charCode;

    switch(key) {

      case 32: //Space
      e.preventDefault();
      alert("Space");
      break;

      case 37: //Arrow left
      e.preventDefault();
      alert("Arrow Left");
      break;

      case 38: //Arrow up
      e.preventDefault();
      alert("Arrow Up");
      break;

      case 39: //Arrow right
      e.preventDefault();
      alert("Arrow Right");
      break;

      case 40: //Arrow down
      e.preventDefault();
      alert("Arrow Down");
      break;
    }
  }
);