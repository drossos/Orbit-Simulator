var canvas = document.getElementById('canvas');
var context = canvas.getContext("2d");
var raceBColor = "black";
canvas.style.background = raceBColor;
var angle = 90;
var speed = .05;
var jCanvas = $('#canvas');
var G = 6.67e-11;
var circleDegree = 360;
var radii = [3]
var addUser;
var addPlanet = $("#addPlanet");
var triangleArea = 0;
var radiusInput = $("#radiusInput"),
    massInput = $("#massInput"),
    distanceInput = $("#distanceInput");
var allFields = $([]).add(radiusInput).add(massInput).add(distanceInput);
//planetsArr struct [planet, starting angle, speed]
var planetsArr = [];
var numPlanets = 0;
$(function() {
    $("#dialog").dialog({
        autoOpen: false,
        modal: true,
        buttons: {
            "Create Planet": function() {
                addToPlanetArr("satalite", "#00BAFF", canvas.width / 2, canvas.height / radii[0], 30, 10);
                addToPlanetArr("test0", "#FF0000", canvas.width / 2, canvas.height / 6, 30, 50);
                //addToPlanetArr("test1", "#00BAFF", canvas.width / 2, canvas.height / radii[0], 20, 50);
                $(this).dialog("close");
            }
        }
    });
});

addPlanet.button().on("click", function() {
    $("#dialog").dialog("open");
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

//TODO BUG WHERE PLANETS MOVE 90 DEGREE THEN START MOTION
function animate() {

    for (var i = 0; i < planetsArr.length; i++) {

        //todo makes so each has unique speed
       // planetsArr[i][1] -= speed;
        planetsArr[i][1] -= getAngleChange(i);

        radius = getRadius(planetsArr[i][0]);
        var testX = center.x - (radius * Math.cos(planetsArr[i][1]));
        var testY = center.y + (radius * Math.sin(planetsArr[i][1]));
        planetsArr[i][0].x = testX;
        planetsArr[i][0].y = testY;
        var temp = planetsArr[i][0].name;

        jCanvas.animateLayer(temp, {
            x: testX,
            y: testY,
            width: planetsArr[i][0].radius,
            height: planetsArr[i][0].radius
        }, 100);


    }
}

function getRadius(planet) {
    var test = Math.sin(30);
    return Math.sqrt(Math.pow(Math.abs(planet.x - center.x), 2) + Math.pow(Math.abs(planet.y - center.y), 2));
}

//todo make better way to add general planet
function addToPlanetArr(name, fill, xPos, yPos, radius, mass) {
    var tempSpeed = getTanVelocity(new Planet(name, fill, xPos, yPos, radius, mass));
    planetsArr.push([new Planet(name, fill, xPos, yPos, radius, mass),90, tempSpeed]);
    planetsArr[numPlanets][0].build();
    numPlanets++;
}

function getTanVelocity(planet) {
    //root(GM/R)
    return Math.sqrt(G * center.mass / getRadius(planet));
    
}

//using Kepler third law
function getOrbitRefreshTime(planetIndex) {
  var temp = Math.pow(getRadius(planetsArr[planetIndex][0]), 3);
    var totalPeriod = 2 * Math.PI * Math.sqrt(Math.pow(getRadius(planetsArr[planetIndex][0]), 3) / (G * center.mass));
    //find what percentage of period is being traveled
    //TODO IF MAKE ELIPSE ORBITS NEED TO CHANGE THIS PORTION AS TIME CHANGES WITH DISTANCE OF TIME
    return speed / 360 * totalPeriod;
}

//every 10 mili seconds 
function getAngleChange(planetIndex) {
    var orbitTime = getOrbitRefreshTime(planetIndex);
    //omega = v/r
    var angVelo = getTanVelocity(planetsArr[planetIndex][0]) / getRadius(planetsArr[planetIndex][0]);
    //omega * t = theta
    //right now sense of scale is so small that no noticable change
    //TODO MAKE A SCALE SO IT ALL WORKS VISUALLY
    return angVelo * 1/orbitTime * 10e9;

}

setInterval(animate, 10);