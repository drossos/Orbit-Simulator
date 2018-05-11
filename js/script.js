var canvas = document.getElementById('canvas');
var context = canvas.getContext("2d");
var raceBColor = "green"
canvas.style.background = raceBColor;

var jCanvas = $('#canvas');

jCanvas.addLayer({
	name: 'centeralPlanet',
	type: 'ellipse',
	fillStyle: '#FFFFFF',
	x: canvas.width/2, y: canvas.height/2,
	width: 100, height: 100
})
.drawLayers();

