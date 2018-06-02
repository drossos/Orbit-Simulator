/*
Daniel Rossos June 2018

Simulator uses a mixture of both jQuery and jCanvas by Caleb Evans for the UI.

Utilizes a combination of Kepler's Laws of Planetary motion as well as rotational dynamics to 
create the orbits of planets
*/
var canvas = document.getElementById('canvas');
initCanvas();
var context = canvas.getContext("2d");
var raceBColor = "black";
canvas.style.background = raceBColor;
var validNums = "1234567890e";
var angle = 90;
//the rate at which the simulation runs
var speed = .00125;
var jCanvas = $('#canvas');
var G = 6.67e-11;
var circleDegree = 360;
var radii = [3]
var addUser;
var addPlanet = $("#addPlanet");
var editCenter = $("#editCenter");
var clearPlanets = $("#clearPlanets");
var triangleArea = 0;
var radiusInput = $("#radiusInput"),
    massInput = $("#massInput"),
    distanceInput = $("#distanceInput");
var allFields = $([]).add(radiusInput).add(massInput).add(distanceInput);
var orbitInfo = $('#orbitInfo');
var centeralInfo = $('#centralInfo');

var colourArr = ["#275AFF", "#2DFA32", "#32FFF3", "#FF740E", "#A0FF7A", "#FFF600", "#AE00FF"];

//planetsArr struct [planet, starting angle, speed]

var planetsArr = [];
var numPlanets = 0;
var pixelToAU = 60;
var middle = canvas.width / 2;
var oneAU = 149597900000;
var secondsPerYear = 31557600;
var mPerSToKmPerH = 3.6
    //standard 10 sec orbit *orbit of earth*
    
var standardOrbitPeriod = 31563692.627345186;
var animationRefreshRate = .0125
var relativeOrbitPeriod = 10;
var massEarth = 5.972e24;
var massSun = 1.989e30;
orbitInfo.dialog({
    autoOpen: false
});
centeralInfo.dialog({
    autoOpen: false
});


$("#nonNumPrompt").dialog({
    autoOpen: false,
    modal: true
});

$(function() {
    $("#dialog").dialog({
        autoOpen: false,
        modal: true,
        buttons: {
            "Create Planet": function() {
                var valid = false;

                if (isNaN(distanceInput.val()) || isNaN(radiusInput.val()) || isNaN(massInput.val())) {
                    valid = false;
                    $("#nonNumPrompt").dialog("open");
                } else {
                    valid = true;

                    //addToPlanetArr("satalite", "#00BAFF", canvas.width / 2, middle - pixelToAU, 20, massEarth);
                    addToPlanetArr("test" + planetsArr.length, colourArr[Math.floor(Math.random() * colourArr.length)], canvas.width / 2, middle - Number(distanceInput.val()) * pixelToAU, Number(radiusInput.val()) / 318.55, Number(massInput.val()));
                    //addToPlanetArr("test1", "#00BAFF", canvas.width / 2, canvas.height / radii[0], 20, 50);
                    $(this).dialog("close");
                }
            }
        }
    });
});

$(function() {
    $("#editCenterDialog").dialog({
        autoOpen: false,
        modal: true,
        buttons: {
            "Edit Center Planet": function() {

                if (isNaN($("#centerMassInput").val())) {
                    $("#nonNumPrompt").dialog("open");
                } else {

                    center.mass = Number($("#centerMassInput").val());

                    //to update the visual speeds of orbits
                    var temp = planetsArr;
                    planetsArr = [];
                    numPlanets = 0;
                    for (i = 0; i < temp.length; i++) {
                        jCanvas.removeLayer(temp[i][0].name + "Orbit");
                        jCanvas.removeLayer(temp[i][0].name);
                        addToPlanetArrAlt(temp[i][0]);
                         $(this).dialog("close");
                    }

                }

            }
        }
    });
});

addPlanet.button().on("click", function() {
    $("#dialog").dialog("open");
});

editCenter.button().on("click", function() {
    $("#editCenterDialog").dialog("open");
});

clearPlanets.button().on("click", function() {

    for (i = 0; i < planetsArr.length; i++) {
        jCanvas.removeLayer(planetsArr[i][0].name + "Orbit");
        jCanvas.removeLayer(planetsArr[i][0].name);
    }
    planetsArr = [];
});


function initCanvas() {
    canvas.width = document.body.clientHeight - 100;
    canvas.height = document.body.clientHeight - 100;
}


function Planet(name, fill, xPos, yPos, radius, mass) {
    this.name = name;
    this.fill = fill;
    this.x = xPos;
    this.y = yPos;
    this.radius = radius;
    this.mass = mass;
}

Planet.prototype.build = function() {
    var id = this.name;
    jCanvas.addLayer({
        name: this.name,
        fillStyle: this.fill,
        type: 'ellipse',
        x: this.x,
        y: this.y,
        width: this.radius,
        height: this.radius,
        mouseover: function(layer) {
            var planetTempIndex = -1;
            for (i = 0; i < planetsArr.length; i++) {
                if (planetsArr[i][0].name === id)
                    planetTempIndex = i;
            }
            var planet = planetsArr[planetTempIndex][0];
            document.getElementById("orbitInfo").innerHTML = "Mass: " + (planet.mass).toFixed(3) + "kg<br>Tangent Velocity: " + (getTanVelocity(planet) * 3.6).toFixed(3) +
                "km/h<br>Period: " + (getOrbitRefreshTime(planetTempIndex) / secondsPerYear).toFixed(3) + "years";
            orbitInfo.dialog('open');
        }
    }).drawLayers();

};

function CenterPlanet(name, fill, radius, mass) {
    this.name = name;
    this.fill = fill;
    this.radius = radius;
    this.mass = mass;
    this.x = middle,
        this.y = middle
}


CenterPlanet.prototype.build = function() {

    jCanvas.addLayer({
        name: this.name,
        fillStyle: this.fill,
        type: 'ellipse',
        x: canvas.width / 2,
        y: canvas.height / 2,
        width: this.radius,
        height: this.radius,
        mouseover: function(layer) {
            document.getElementById("centralInfo").innerHTML = "Mass: " + (center.mass).toFixed(3) + "kg";
            centeralInfo.dialog('open');
        }
    }).drawLayers();

};

var center = new CenterPlanet("central", "#FF0000", 50, massSun);
center.build();

/*var testSatlite = new Planet("satalite", "#00BAFF", canvas.width / 2, canvas.height / radii[0], 30, 10);
testSatlite.build();*/

/*var radius = getRadius(testSatlite);*/


function animate() {

    for (var i = 0; i < planetsArr.length; i++) {
        //todo makes so each has unique speed
        // planetsArr[i][1] -= speed;
        planetsArr[i][1] += getAngleChange(i);

        radius = getRadius(planetsArr[i][0]);
        var testX = center.x + (radius * Math.cos(planetsArr[i][1]));
        var testY = center.y + (radius * Math.sin(planetsArr[i][1]));
        planetsArr[i][0].x = testX;
        planetsArr[i][0].y = testY;
        var temp = planetsArr[i][0].name;

        jCanvas.animateLayer(temp, {
            x: testX,
            y: testY,
            width: planetsArr[i][0].radius,
            height: planetsArr[i][0].radius
        }, 10);

    }
}

function getRadius(planet) {
    // var test = Math.sin(30);
    return Math.sqrt(Math.pow(Math.abs(planet.x - center.x), 2) + Math.pow(Math.abs(planet.y - center.y), 2));
}

//todo make better way to add general planet
function addToPlanetArr(name, fill, xPos, yPos, radius, mass) {
    var tempSpeed = getTanVelocity(new Planet(name, fill, xPos, yPos, radius, mass));
    planetsArr.push([new Planet(name, fill, xPos, yPos, radius, mass), angle, tempSpeed]);
    planetsArr[numPlanets][0].build();
    buildOrbitPath(planetsArr[numPlanets][0]);
    numPlanets++;
}

function addToPlanetArrAlt(planet) {
    var tempSpeed = getTanVelocity(planet);
    planetsArr.push([planet, angle, tempSpeed]);
    planetsArr[numPlanets][0].build();
    buildOrbitPath(planetsArr[numPlanets][0]);
    numPlanets++;
}

function getTanVelocity(planet) {
    //root(GM/R)
    //take radius/pixelToAU to see number of au then mult to get metere
    var test = (getRadius(planet) / pixelToAU * oneAU);
    return Math.sqrt(G * center.mass / (getRadius(planet) / pixelToAU * oneAU));
}

//using Kepler third law
/*
T = 2*pi*root(a^3/GM)
*/
function getOrbitRefreshTime(planetIndex) {
    var temp = Math.pow(getRadius(planetsArr[planetIndex][0]), 3);
    var totalPeriod = 2 * Math.PI * Math.sqrt(Math.pow(getRadius(planetsArr[planetIndex][0]) / pixelToAU * oneAU, 3) / (G * center.mass));
    //find what percentage of period is being traveled
    //TODO IF MAKE ELIPSE ORBITS NEED TO CHANGE THIS PORTION AS TIME CHANGES WITH DISTANCE OF TIME
    //speed meaning how much of orbit per animate cycle
    return totalPeriod;
}

//every 10 mili seconds 
function getAngleChange(planetIndex) {
    var orbitTime = getOrbitRefreshTime(planetIndex);
    //omega = v/r
    // var angVelo = getTanVelocity(planetsArr[planetIndex][0]) / (getRadius(planetsArr[planetIndex][0]) /pixelToAU * oneAU);
    var angVelo = (2 * Math.PI) / orbitTime;
    //omega * t = theta
    //right now sense of scale is so small that no noticable change
    
    // return angVelo *orbitTime;
    return getRelativeChange(orbitTime, angVelo);

}


/*
DEV NOTE
Since making the planets angle change all in reference to themselves, there was issues in making the outer orbits and inner orbits
differ. So instead of making them reference only there own data, the orbit of earth was considered the standard orbit and all planets
orbited in reference to this orbit
*/
function getRelativeChange(orbitTime, angVelo) {
    //get durration of orbit
    var relativePeriod = (orbitTime / standardOrbitPeriod) * relativeOrbitPeriod;
    var relativeAngVelo = (2 * Math.PI) / relativePeriod;

    return animationRefreshRate * relativeAngVelo;
}

//build orbit path
function buildOrbitPath(planet) {
    var radius = getRadius(planet);

    jCanvas.addLayer({
        name: planet.name + "Orbit",
        type: 'arc',
        index: 0,
        strokeStyle: '#36c',
        strokeWidth: 4,
        x: middle,
        y: middle,
        radius: radius
    }).drawLayers();
}


setInterval(animate, animationRefreshRate);