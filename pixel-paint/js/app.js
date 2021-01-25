var isMouseDown = false;
document.onmousedown = function() { isMouseDown = true };
document.onmouseup   = function() { isMouseDown = false };

function getBackgroundColor(idName){
  var element = document.getElementById(idName);
  var style = window.getComputedStyle(element, null).getPropertyValue("background-color");
  document.getElementById('backgroundName').style.backgroundColor = style;
}

function changeColor(idName){
  if(isMouseDown) {
    var originalElementColor = document.getElementById('backgroundName').style.backgroundColor;
    document.getElementById(idName).style.backgroundColor = originalElementColor;
  }
}

function changeColorOnClick(idName){
  var originalElementColor = document.getElementById('backgroundName').style.backgroundColor;
  document.getElementById(idName).style.backgroundColor = originalElementColor;
}

function erase(){
  document.getElementById('backgroundName').style.backgroundColor = "white";
}

function fillCanvas(){
  var elements = document.getElementsByClassName('canvas');
  var originalElementColor = document.getElementById('backgroundName').style.backgroundColor;
  for (var i = 0; i < elements.length; i++) {
    elements[i].style.background = originalElementColor;
  }
}

function clearCanvas(){
  var elements = document.getElementsByClassName('canvas');
  for (var i = 0; i < elements.length; i++) {
    elements[i].style.background = "white";
  }
}
