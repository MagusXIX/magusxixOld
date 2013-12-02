var count = 0;

var Planet = function () {

  this.defineProperties({
      name: {type: 'string'}
    , planetType: {type: 'string'}
    , radius: {type: 'number'}
    , year: {type: 'number'}
    , distance: {type: 'number'}
    , rotation: {type: 'number'}
    , revolution: {type: 'number'}
  });

};

Planet.generate = function (star) {
  
  var name = 'Temporary';
  var typeNumber = Math.ceil(Math.random() * 8);
  var type = '';
  var radius = 0;

  if (typeNumber == 1) {
    type = 'mercury';
    radius = Math.floor((Math.random() * (4000000 - 1000000)) + 1000000);
  } else if (typeNumber == 2) {
    type = 'venus';
    radius = Math.floor((Math.random() * (10000000 - 2000000)) + 2000000);
  } else if (typeNumber == 3) {
    type = 'earth';
    radius = Math.floor((Math.random() * (15000000 - 3000000)) + 3000000);
  } else if (typeNumber == 4) {
    type = 'mars';
    radius = Math.floor((Math.random() * (12000000 - 2000000)) + 2000000);
  } else if (typeNumber == 5) {
    type = 'jupiter';
    radius = Math.floor((Math.random() * (120000000 - 40000000)) + 40000000);
  } else if (typeNumber == 6) {
    type = 'saturn';
    radius = Math.floor((Math.random() * (90000000 - 25000000)) + 25000000);
  } else if (typeNumber == 7) {
    type = 'uranus';
    radius = Math.floor((Math.random() * (45000000 - 10000000)) + 10000000);
  } else if (typeNumber == 8) {
    type = 'neptune';
    radius = Math.floor((Math.random() * (40000000 - 10000000)) + 10000000);
  };

  var distance = Math.floor(Math.random() * ((star.radius * 10000) - (star.radius * 100)) + (star.radius * 100));
  var tacticalDistance = distance / 149597870700;
  var rotation = (Math.random() * 2) * (2 * Math.PI) / 5184000;
  var revolution = ((2 * Math.PI) / 1893414000) / (Math.random() * tacticalDistance);
  var circle = Math.PI * 2;
  var day = 0;

  var yearCalculated = function () {
    var planetYear = day / 365;
    var tempPlanet = generator(planetYear);
    return tempPlanet;
  }

  var yearCalculator = function () {

    if ((revolution * 5184000) >= circle) {
      day++;
      return yearCalculated();
    }

    for (var dailyRevolution = revolution * 5184000; dailyRevolution < circle; dailyRevolution += (revolution * 5184000)) {
      var nextIncrement = dailyRevolution + (revolution * 5184000);
      day ++;

      if (nextIncrement >= circle) {
        return yearCalculated();
      };

    }

  };

  function generator (planetYear) {

    var planetProperties = {
        name: name
      , planetType: type
      , radius: radius
      , year: planetYear
      , distance: distance
      , rotation: rotation
      , revolution: revolution
    };

    var tempPlanet = geddy.model.Planet.create(planetProperties);
    geddy.model.Grid.generate(tempPlanet);

    return tempPlanet;

  }

  var tempPlanet = yearCalculator();
  return tempPlanet;

}

Planet.locationFinder = function (planet) {

  var milliTime = new Date().getTime();
  var useableTime = (milliTime * 0.001) * 60;
  var year = new Date().getFullYear();
  var degreesSince1970 = ((year - 1970) * 360) / planet.year;
  var startTotalRevolutionAngle = (planet.revolution * useableTime) * 57.2957795;
  var startRevolutionAngle = Math.abs(startTotalRevolutionAngle - degreesSince1970);
  var currentRevolutionAngle, currentPositionX, currentPositionY, currentPosition;

  incrementalRevolutionAngle = planet.revolution * (useableTime);
  currentRevolutionAngle = startRevolutionAngle + incrementalRevolutionAngle;

  if (currentRevolutionAngle >= 360) {
    currentRevolutionAngle = currentRevolutionAngle - 360;
  }

  if (currentRevolutionAngle > 270) {
    var triangleDegree = 360 - currentRevolutionAngle;
    currentPositionX = Math.cos(triangleDegree * 0.0174532925) * planet.distance;
    currentPositionY = (Math.sin(triangleDegree * 0.0174532925) * planet.distance) * -1;
    currentPosition = [currentPositionX, currentPositionY];
  } else if (currentRevolutionAngle == 270) {
    currentPositionX = 0;
    currentPositionY = planet.distance * -1;
    currentPosition = [currentPositionX, currentPositionY];
  } else if (currentRevolutionAngle > 180) {
    var triangleDegree = 270 - currentRevolutionAngle;
    currentPositionX = (Math.sin(triangleDegree * 0.0174532925) * planet.distance) * -1;
    currentPositionY = (Math.cos(triangleDegree * 0.0174532925) * planet.distance) * -1;
    currentPosition = [currentPositionX, currentPositionY];
  } else if (currentRevolutionAngle == 180) {
    currentPositionX = planet.distance * -1;
    currentPositionY = 0;
    currentPosition = [currentPositionX, currentPositionY];
  } else if (currentRevolutionAngle > 90) {
    var triangleDegree = 180 - currentRevolutionAngle;
    currentPositionX = (Math.cos(triangleDegree * 0.0174532925) * planet.distance) * -1;
    currentPositionY = Math.sin(triangleDegree * 0.0174532925) * planet.distance;
    currentPosition = [currentPositionX, currentPositionY];
  } else if (currentRevolutionAngle == 90) {
    currentPositionX = 0;
    currentPositionY = planet.distance;
    currentPosition = [currentPositionx, currentPositionY];
  } else if (currentRevolutionAngle > 0) {
    var triangleDegree = 90 - currentRevolutionAngle;
    currentPositionX = Math.sin(triangleDegree * 0.0174532925) * planet.distance;
    currentPositionY = Math.cos(triangleDegree * 0.0174532925) * planet.distance;
    currentPosition = [currentPositionX, currentPositionY];
  } else if (currentRevolutionAngle == 0) {
    currentPositionX = planet.distance;
    currentPositionY = 0;
    currentPosition = [currentPositionX, currentPositionY];
  }

  planet.position = currentPosition;

  return planet.position;

}

exports.Planet = Planet;

