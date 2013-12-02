console.log('HEY! YOU ARE IN CAMERAJS!');

var celestialSensorMesh = require('../meshes/celestialSensor.js');
var sectorModel = require('../models/sector.js');
var sectorMesh = require('../meshes/sector.js');
var systemModel = require('../models/system.js');
var systemMesh = require('../meshes/system.js');
var starModel = require('../models/star.js');
var starMesh = require('../meshes/star.js');
var planetModel = require('../models/planet.js');
var planetMesh = require('../meshes/planet.js');
var shipMesh = require('../meshes/ship.js');

var systemArray = [];
var visualArray = [];
var shipArray = [];
var initialPosition = [];
    initialPosition.push(0, 0);

/*var modules = [];

var rearEnginePort = {
  position: [-100000, -150000, 0],
  moduleType: 'engine'
}
modules.push(rearEnginePort);

var rearEngineStarboard = {
  position: [100000, -150000, 0],
  moduleType: 'engine'
}
modules.push(rearEngineStarboard);

var reactor = {
  position: [0, -100000, 0],
  moduleType: 'reactor'
}
modules.push(reactor);

var tank = {
  position: [0, 0, 0],
  moduleType: 'tank'
}
modules.push(tank);

var bridge = {
  position: [0, 100000, 0],
  moduleType: 'command'
}
modules.push(bridge);

var ship = shipMesh(modules);
    ship.shipType = 'devBoat';
    shipArray.push(ship); */

var destroyer = function (scene, camera, creator) {
  var self = this;

  for (var i in systemArray) {

    scene.remove(systemArray[i])

  }

  for (var i in visualArray) {

    scene.remove(visualArray[i]);

  }

  for (var i in shipArray) {

    scene.remove(shipArray[i]);

  }

  initialPosition.length = 0;
  initialPosition.push(0, 0);

  creator(scene, camera);
}

var strategicCreator = function (scene, camera) {
  var self = this;

  if (scene.children.length > 2) {

    console.log('Too many children, destroy some.');
    destroyer(scene, camera, strategicCreator);

  } else {

    sectorModel.load(camera.sector.position[0], camera.sector.position[1], function (sector) {

      systemModel.load(sector.id, function (systems) {

        var cameraSetter = function (systems, mapMaker) {

          for (var i in systems) {

            if (camera.system.id == systems[i].id) {
              console.log('Reseting camera.');
              camera.position.set(systems[i].strategicPosition[0], systems[i].strategicPosition[1], 2);
              camera.near = 0.01;
              camera.far = 1000;
              camera.updateProjectionMatrix();
            }

          }

          mapMaker(systems);

        }

        var mapMaker = function (systems) {

          for (var i in systems) {
            
            var system = systemMesh.strategic(camera, systems[i]);

            systemArray.push(system);
            scene.add(system);
            camera.view = 'strategic';

          }

        }

        cameraSetter(systems, mapMaker) 

      })

    })

  }

}

var tacticalCreator = function (scene, camera) {
  var self = this;
  
  if (scene.children.length > 2) {

    console.log('Too many children, destroy some.');
    destroyer(scene, camera, strategicCreator);

  } else {

    sectorModel.load(10, 20, function (sector) {
      camera.sector = sector;

      systemModel.load(sector.id, function (systems) {
        // this callback may be called multiple times
        for (var i in systems) {

          if (Math.abs(camera.position.x - systems[i].strategicPosition[0]) <= 0.5 && Math.abs(camera.position.y - systems[i].strategicPosition[1]) <= 0.5 && camera.view != 'visual') {

            var thisSystem = systems[i];
            camera.system = systems[i];

            starModel.load(thisSystem.id, function (stars) {
              scene.stars = stars;

              camera.position.set(0, 0, stars[0].radius * 50000);
              camera.near = 100000000;
              camera.far = 2000000000000000;
              camera.updateProjectionMatrix();

              var system = systemMesh.tactical(thisSystem, stars[0]);
                  system.systemId = thisSystem.id;

              for (var i in stars) {
                var starBlip = celestialSensorMesh(camera, stars[i]);
                system.add(starBlip);
              }
              

              planetModel.load(thisSystem.id, function (planets) {
                scene.planets = planets;
                
                for (var i in planets) {

                  //Create the sensor blip.
                  var planetBlip = celestialSensorMesh(camera, planets[i]);
                  system.add(planetBlip);

                  //Create the trajectory circle.
                  var circle = new THREE.Shape();
                      circle.moveTo(0, 0);
                      circle.arc(0, 0, planets[i].distance, 0, Math.PI * 2, false);

                  var geometry = circle.createPointsGeometry(500);
                      geometry.vertices.shift();
                      geometry.vertices.pop();
                      geometry.vertices.push(geometry.vertices[0]);

                  var material = new THREE.LineBasicMaterial({color: 0x333399, depthWrite: false});

                  var trajectory = new THREE.Line(geometry, material, THREE.LineStrip);
                  system.add(trajectory);

                  /*if (planets[i].planetType == 'earth' && !ship.place) {
                    ship.place = planets[i].id;
                  }*/

                }

                systemArray.push(system);
                scene.add(system);
                camera.view = 'tactical';

              })

            })

          } else if (camera.view == 'visual' && camera.system.id == systems[i].id) {

            var thisSystem = systems[i];

            starModel.load(thisSystem.id, function (stars) {
              scene.stars = stars;

              camera.near = 100000000;
              camera.far = 2000000000000000;
              camera.updateProjectionMatrix();

              var system = systemMesh.tactical(thisSystem, stars[0]);
                  system.systemId = thisSystem.id;

              for (var i in stars) {
                var starBlip = celestialSensorMesh(camera, stars[i]);
                system.add(starBlip);
              }
              

              planetModel.load(thisSystem.id, function (planets) {
                scene.planets = planets;
                
                for (var i in planets) {

                  //Create the sensor blip.
                  var planetBlip = celestialSensorMesh(camera, planets[i]);
                  system.add(planetBlip);

                  //Create the trajectory circle.
                  var circle = new THREE.Shape();
                      circle.moveTo(0, 0);
                      circle.arc(0, 0, planets[i].distance, 0, Math.PI * 2, false);

                  var geometry = circle.createPointsGeometry(500);
                      geometry.vertices.shift();
                      geometry.vertices.pop();
                      geometry.vertices.push(geometry.vertices[0]);

                  var material = new THREE.LineBasicMaterial({color: 0x333399, depthWrite: false});

                  var trajectory = new THREE.Line(geometry, material, THREE.LineStrip);
                  system.add(trajectory);

                }

                systemArray.push(system);
                scene.add(system);
                camera.view = 'tactical';

              })

            })

          }

        }

      })
    })

  }
}

var visualCreator = function (scene, camera) {
  var self = this;

  if (scene.children.length > 2) {

    console.log('Too many children, destroy some.');
    destroyer(scene, camera, strategicCreator);

  } else {

    camera.position.set(0, 0, camera.position.z);
    camera.near = 1000;
    camera.far = 1000000000000000;
    camera.updateProjectionMatrix();
    camera.view = 'visual';

    if (camera.place.planetId) {

      planetModel.load(camera.system.id, function (planets) {

        for (var i in planets) {

          if (planets[i].id == camera.place.planetId) {

            var visualPlanet = planetMesh(planets[i]);
            var visualSensor = celestialSensorMesh(camera, planets[i]);
            visualArray.push(visualPlanet);
            visualArray.push(visualSensor);
            scene.add(visualPlanet);
            scene.add(visualSensor);

            /*if (camera.place.planetId == ship.place) {
              ship.position.set(0, planets[i].radius * 1.5, 0);
              scene.add(ship);
            }*/

          }

        }

      })

    } else if (camera.place.starId) {

      starModel.load(camera.system.id, function (stars) {

        for (var i in stars) {

          if (stars[i].id == camera.place.starId) {

            var visualStar = starMesh(stars[i]);
            var visualSensor = celestialSensorMesh(camera, stars[i]);
            visualArray.push(visualStar);
            visualArray.push(visualSensor);
            scene.add(visualStar);
            scene.add(visualSensor);

          }

        }

      })

    }
  }
  

}

var camera = {

    controls: function(scene, camera) {

      document.addEventListener("mousewheel", zoom, false);
      document.addEventListener("keydown", pan, false);
      document.addEventListener("mousedown", pan, false);

      function zoom(e) { //change system position by a factor of wheel delta relative to distance from camera
        
        var zoomValue = (camera.position.z / 1000) * e.wheelDelta;
        var newZoom = camera.position.z + zoomValue;

        if (camera.view == 'visual' && newZoom < 1000) {
          newZoom = 1000;
          camera.position.z = newZoom;
          console.log(camera.position.z);

        } else if (camera.view == 'strategic' && newZoom > 50) {
          newZoom = 50;
          camera.position.z = newZoom;
          console.log(camera.position.z);

        } else {

          camera.position.z = newZoom;
          console.log(camera.position.z);

          var sensorGeo = new THREE.CircleGeometry(Math.abs(camera.position.z / 75), 50, 0, Math.PI * 2);
          var sensorMat = new THREE.MeshBasicMaterial({
            color: 0x333399,
          });

          //BEGIN STRATEGIC SCENE REFRESHER
          if (camera.view == 'strategic') {

          }
          //END STRATEGIC SCENE REFRESHER

          //BEGIN TACTICAL SCENE REFRESHER
          if (camera.view == 'tactical') {

            for (var i in scene.children) {

              if (scene.children[i].systemId) {

                var system = scene.children[i];

                for (var i in system.children) {

                  if (system.children[i].sensorType) {

                    var mesh = new THREE.Mesh(sensorGeo, sensorMat);
                        mesh.position.set(system.children[i].position.x, system.children[i].position.y, system.children[i].position.z);
                        mesh.sensorType = 'celestial';

                    if (system.children[i].planetId) {
                      mesh.planetId = system.children[i].planetId;
                    } else if (system.children[i].starId) {
                      mesh.starId = system.children[i].starId;
                    }

                    systemArray.push(mesh);
                    system.remove(system.children[i]);
                    system.add(mesh);

                  }

                }

              }

            }

          }
          //END TACTICAL SCENE REFRESHER

          //BEGIN VISUAL SCENE REFRESHER
          if (camera.view == 'visual') {

            for (var i in scene.children) {

              if (scene.children[i].sensorType) {

                var mesh = new THREE.Mesh(sensorGeo, sensorMat);
                    mesh.position.set(scene.children[i].position.x, scene.children[i].position.y, scene.children[i].position.z);
                    mesh.sensorType = 'celestial';

                if (scene.children[i].planetId) {
                  mesh.planetId = scene.children[i].planetId;
                } else if (scene.children[i].starId) {
                  mesh.starId = scene.children[i].starId;
                }

                visualArray.push(mesh);
                scene.remove(scene.children[i]);
                scene.add(mesh);

              }

            }

          }
          //END VISUAL SCENE REFRESHER

        }

      };

      function pan(e) {

        xValue = camera.position.z / 100;
        yValue = camera.position.z / 100;

        switch (e.keyCode) {
          case 37: // Left
            camera.position.x -= xValue;
          break;

          case 38: // Up
            camera.position.y += yValue;
          break;

          case 39: // Right
            camera.position.x += xValue;
          break;

          case 40: // Down
            camera.position.y -= yValue;
          break;
        }

        if (e.which == 3) {
          var initialX = e.clientX;
          var initialY = e.clientY;
          var updatedX = e.clientX;
          var updatedY = e.clientY;
          document.addEventListener("mousemove", mousePan, false);
          var mouseDown = true;

          var interval = setInterval(function(){
            if (!mouseDown) {
              clearInterval(interval);
            }
            if (initialX != updatedX) {
              camera.position.x += ((updatedX - initialX) * (camera.position.z / 100000));
            }

            if (initialY != updatedY) {
              camera.position.y -= ((updatedY - initialY) * (camera.position.z / 100000));
            }

          }, 16)

          function mousePan (e) {

            updatedX = e.clientX;
            updatedY = e.clientY;

            if (!document.addEventListener("mouseup", mouseUp, false)) {
              document.addEventListener("mouseup", mouseUp, false);
            }
            function mouseUp() {
              if (e.which == 3) {
                document.removeEventListener("mousemove", mousePan, false);
                document.removeEventListener("mouseup", mouseUp, false);
                mouseDown = false;
              }
            }

          }
        }

      }

    }

  , strategicLoad: function (scene, camera) {
      var self = this;

      destroyer(scene, camera, strategicCreator);
    }

  , tacticalLoad: function (scene, camera) {
      var self = this;

      destroyer(scene, camera, tacticalCreator);
    }

  , tacticalAnimation: function (scene, camera) {
      var self = this;

      //UPDATE PLANETARY REVOLUTION
      for (var i in scene.planets) {

        for (var a in scene.children) {

          if (scene.children[a].systemId) {

            for (var r in scene.children[a].children) {

              if (scene.children[a].children[r].planetId == scene.planets[i].id) {
                //console.log(scene.children[a].children[r]);

                var milliTime = new Date().getTime();
                var useableTime = (milliTime * 0.001) * 60;
                var year = new Date().getFullYear();
                var planet = scene.planets[i];
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

                scene.children[a].children[r].position.x = currentPositionX;
                scene.children[a].children[r].position.y = currentPositionY;

              }

            }

          }

        }

      }
      //END PLANETARY REVOLUTION UPDATE

      //UPDATE CAMERA PLACE

      for (var i in scene.children) {

        if (scene.children[i].systemId) {

          var falsehoods = 0;

          for (var r = 0; r < scene.children[i].children.length; r++) {

            if (Math.abs(camera.position.x - scene.children[i].children[r].position.x) <= 250000000000 && Math.abs(camera.position.y - scene.children[i].children[r].position.y) <= 25000000000 && camera.position.z <= 5000000000000 && camera.position.z >= 10000) {

              console.log('Trued!');
              camera.place = scene.children[i].children[r];

            } else {

              falsehoods++

              if (falsehoods >= scene.children[i].children.length) {

                camera.place = false;

              }

            }

          }

        }

      }

    }

  , visualLoad: function (scene, camera) {
      var self = this;

      destroyer(scene, camera, visualCreator);
    }

  , visualAnimation: function (scene, camera) {

    for (var i in scene.children) {

        for (var r in scene.planets) {

          if (scene.children[i].planetId == scene.planets[r].id) {

            var planet = scene.planets[r];
            var planetMesh = scene.children[i];

            var milliTime = new Date().getTime();
            var useableTime = (milliTime * 0.001) * 60;
            var year = new Date().getFullYear();
            var degreesSince1970 = ((year - 1970) * 360) / planet.year;
            var startTotalRevolutionAngle = (planet.revolution * useableTime) * 57.2957795;
            var startRevolutionAngle = Math.abs(startTotalRevolutionAngle - degreesSince1970);
            var currentRevolutionAngle, projectedPositionX, projectedPositionY, projectedPosition;

            incrementalRevolutionAngle = planet.revolution * (useableTime);
            currentRevolutionAngle = startRevolutionAngle + incrementalRevolutionAngle;

            if (currentRevolutionAngle >= 360) {
              currentRevolutionAngle = currentRevolutionAngle - 360;
            }

            if (currentRevolutionAngle > 270) {
              var triangleDegree = 360 - currentRevolutionAngle;
              projectedPositionX = Math.cos(triangleDegree * 0.0174532925) * planet.distance;
              projectedPositionY = (Math.sin(triangleDegree * 0.0174532925) * planet.distance) * -1;
              projectedPosition = [projectedPositionX, projectedPositionY];
            } else if (currentRevolutionAngle == 270) {
              projectedPositionX = 0;
              projectedPositionY = planet.distance * -1;
              projectedPosition = [projectedPositionX, projectedPositionY];
            } else if (currentRevolutionAngle > 180) {
              var triangleDegree = 270 - currentRevolutionAngle;
              projectedPositionX = (Math.sin(triangleDegree * 0.0174532925) * planet.distance) * -1;
              projectedPositionY = (Math.cos(triangleDegree * 0.0174532925) * planet.distance) * -1;
              projectedPosition = [projectedPositionX, projectedPositionY];
            } else if (currentRevolutionAngle == 180) {
              projectedPositionX = planet.distance * -1;
              projectedPositionY = 0;
              projectedPosition = [projectedPositionX, projectedPositionY];
            } else if (currentRevolutionAngle > 90) {
              var triangleDegree = 180 - currentRevolutionAngle;
              projectedPositionX = (Math.cos(triangleDegree * 0.0174532925) * planet.distance) * -1;
              projectedPositionY = Math.sin(triangleDegree * 0.0174532925) * planet.distance;
              projectedPosition = [projectedPositionX, projectedPositionY];
            } else if (currentRevolutionAngle == 90) {
              projectedPositionX = 0;
              projectedPositionY = planet.distance;
              projectedPosition = [projectedPositionx, projectedPositionY];
            } else if (currentRevolutionAngle > 0) {
              var triangleDegree = 90 - currentRevolutionAngle;
              projectedPositionX = Math.sin(triangleDegree * 0.0174532925) * planet.distance;
              projectedPositionY = Math.cos(triangleDegree * 0.0174532925) * planet.distance;
              projectedPosition = [projectedPositionX, projectedPositionY];
            } else if (currentRevolutionAngle == 0) {
              projectedPositionX = planet.distance;
              projectedPositionY = 0;
              projectedPosition = [projectedPositionX, projectedPositionY];
            }

            if (initialPosition[0] == 0 && initialPosition[1] == 0) {

              initialPosition = projectedPosition;

            }

            scene.children[i].position.x = projectedPosition[0] - initialPosition[0];
            scene.children[i].position.y = projectedPosition[1] - initialPosition[1];
            scene.children[i].rotation.y += scene.planets[r].rotation * Math.PI / 180;

          }

          if (camera.place.planetId) {

            if (scene.children[i].name == 'light') {

              scene.children[i].position.x = 0 - initialPosition[0];
              scene.children[i].position.y = 0 - initialPosition[1];
              scene.children[i].position.z = 0;

            }

          }

        }

        for (var a in scene.stars) {

          if (scene.children[i].starId == scene.stars[a].id) {

            var star = scene.stars[a];
            var starMesh = scene.children[i];

          }

          if (camera.place.starId) {

            if (scene.children[i].name == 'light') {

              scene.children[i].position.set(camera.position.x, camera.position.y, camera.position.z + 10000)

            }
            
          }

        }

    }

  }

};

module.exports = camera;