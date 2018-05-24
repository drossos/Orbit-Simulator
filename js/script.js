var canvas = document.getElementById('canvas');
var context = canvas.getContext("2d");
var raceBColor = "green";
canvas.style.background = raceBColor;
var angle = 80;
var speed = .05;
var jCanvas = $('#canvas');

var radii = [3]
var addUser;
var addPlanet = $("#addPlanet");

var radiusInput = $("#radiusInput"), massInput = $("#massInput"),distanceInput=$("#distanceInput");
var allFields = $( [] ).add( radiusInput ).add( massInput ).add( distanceInput );

var planetsArr = [];
var numPlanets = 0;
$( function() {
    $( "#dialog" ).dialog({
      autoOpen:false,
      modal:true,
      buttons:{
        "Create Planet" : function (){
         addToPlanetArr("satalite", "#00BAFF", canvas.width / 2, canvas.height / radii[0], 30, 10);
          addToPlanetArr("test0", "#FF0000", canvas.width / 4, canvas.height / radii[0], 30, 50);
          //addToPlanetArr("test1", "#00BAFF", canvas.width / 2, canvas.height / radii[0], 20, 50);
          $(this).dialog("close");
        }
      }
    });
  } );

addPlanet.button().on("click",function (){
  $( "#dialog" ).dialog("open");
});

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

/*var testSatlite = new Planet("satalite", "#00BAFF", canvas.width / 2, canvas.height / radii[0], 30, 10);
testSatlite.build();*/

/*var radius = getRadius(testSatlite);*/

function animate() {

for (i =0; i < planetsArr.length;i++){
radius = getRadius(planetsArr[i][0]);
var testX = center.x - (radius * Math.cos(angle));
var testY = center.y + (radius * Math.sin(angle));
planetsArr[i][0].x = testX;
planetsArr[i][0].y = testY;
var temp = planetsArr[i][0].name;
//right now does not return to origin pos

    jCanvas.animateLayer(temp, {
        x: testX,
        y: testY,
        width: planetsArr[i][0].radius,
        height: planetsArr[i][0].radius
    }, 100);
//todo makes so each has unique speed
   // planetsArr[i][1]-= speed;
   angle -= speed;

  }
}

function getRadius(planet) {
    var test = Math.sin(30);
    return Math.sqrt(Math.pow(Math.abs(planet.x - center.x), 2) + Math.pow(Math.abs(planet.y - center.y), 2));
}

//todo make better way to add general planet
function addToPlanetArr (name, fill, xPos, yPos, radius, mass){
  planetsArr.push([new Planet(name, fill, xPos, yPos, radius, mass),80]);
  planetsArr[numPlanets][0].build(); 
  numPlanets++;
}
setInterval(animate, 10);