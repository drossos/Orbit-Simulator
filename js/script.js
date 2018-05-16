var canvas = document.getElementById('canvas');
var context = canvas.getContext("2d");
var raceBColor = "green"
canvas.style.background = raceBColor;

var jCanvas = $('#canvas');

var radii = [3]

function Planet(name, fill, xPos, yPos, width, height,mass) {
    this.name = name;
    this.fill = fill;
    this.xPos = xPos;
    this.yPos = yPos;
    this.width = width;
    this.height = height;
    this.mass = mass;
}

Planet.prototype.build = function() {
    jCanvas.addLayer({
       name: this.name,
       fillStyle: this.fill,
       type: 'ellipse',
       x: this.xPos,
       y: this.yPos,
       width: this.width,
       height: this.height
    }).drawLayers();
};

var center = new Planet("central","#FF0000", canvas.width/2, canvas.height/2, 100, 100, 50);
center.build();

var testSatlite = new Planet("satalite", "#00BAFF", canvas.width/2, canvas.height/radii[0], 30, 30, 10);
testSatlite.build();

//right now does not return to origin pos
jCanvas.animateLayer('satalite',{
  x:150, y:150,
  width: 30, height: 30
}, 1000, /*function(layer){
  $(this).animateLayer(layer, {
    x: canvas.width/2, y: canvas.height/radii[0]
  }, 'slow', 'translation');
}*/);

