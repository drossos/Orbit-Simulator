var canvas = document.getElementById('canvas');
var context = canvas.getContext("2d");
var raceBColor = "green";
canvas.style.background = raceBColor;
var angle = 80;
var speed = 5;
var jCanvas = $('#canvas');

var radii = [3]

function Planet(name, fill, xPos, yPos, radius, mass) {
    this.name = name;
    this.fill = fill;
    this.x = xPos;
    this.y = yPos;
    this.radius = radius;
    this.mass = mass;
}

Planet.prototype.build = function() {
    jCanvas.addLayer({
        name: this.name,
        fillStyle: this.fill,
        type: 'ellipse',
        x: this.x,
        y: this.y,
        width: this.radius,
        height: this.radius
    }).drawLayers();
};

var center = new Planet("central", "#FF0000", canvas.width / 2, canvas.height / 2, 100, 50);
center.build();

var testSatlite = new Planet("satalite", "#00BAFF", canvas.width / 2, canvas.height / radii[0], 30, 10);
testSatlite.build();
function animate() {

var testX = center.x - (getRadius(testSatlite) * Math.cos(70));
var testY = center.y + (getRadius(testSatlite) * Math.sin(70));
testSatlite.x = testX;
testSatlite.y = testY;
//right now does not return to origin pos

    jCanvas.animateLayer('satalite', {
        x: testX,
        y: testY,
        width: 30,
        height: 30
    }, 1000);

    angle-= speed;
}

function getRadius(planet) {
    var test = Math.sin(30);
    return Math.sqrt(Math.pow(Math.abs(planet.x - center.x), 2) + Math.pow(Math.abs(planet.y - center.y), 2));
}

setInterval(animate, 100);