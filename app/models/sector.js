var count = 0;

var Sector = function () {

  this.defineProperties({
      position: {type: 'object'}
    , density: {type: 'number'}
  });

  this.hasMany('Systems');

};

Sector.generate = function () {

  var position = [];
      position.push(10, 20);
  //var density = (1 - (Math.abs(Math.sqrt((position[0] * position[0]) + (position[1] * position[1])) * 0.01))) / 3;
  var density = 0.05;

  var sectorProperties = {
      position: position
    , density: density
  }

  var sectorCreator = function (sectorProperties, systemCreator, starCreator, planetCreator) {

    var sector = geddy.model.Sector.create(sectorProperties);
        sector.save(function (err, data) {

          if (err) {

            geddy.log.error(err);

          } else {

            for (var width = 1; width <= 100; width++) {

              for (var height = 1; height <= 100; height ++) {

                var systemCheck = Math.random();

                if (systemCheck <= sector.density) {

                  systemCreator(width, height, sector);

                }

                if (width == 100 && height == 100) {

                  var systemIterator = function (skip) {

                    geddy.model.System.all({}, {skip: skip, limit: 10}, function (err, systems) {

                      for (var i in systems) {

                        starCreator(planetCreator, systems[i]);

                      }

                      if (systems.length == 10) {

                        systemIterator(skip += 10);

                      }

                    })

                  }

                  systemIterator(0);

                }

              }

            }

          }

        });

  };

  var systemCreator = function (width, height, sector) {

    var newSystem = geddy.model.System.generate(width, height);
        sector.addSystem(newSystem);
        newSystem.save(function (err, data) {

          if (err) {

            geddy.log.error(err);

          }

        })

  }

  var starCreator = function (planetCreator, system) {

    //count++;
    //console.log(count);

    var newStar = geddy.model.Star.generate();
        system.addStar(newStar);
        newStar.save(function (err, data) {

          if (err) {

            geddy.log.error(err);

          } else {

            var planetCount = Math.round(Math.random() * 20);

            if (planetCount <= 10) {

              for (var i = 0; i < planetCount; i++) {

                planetCreator(newStar, system);

              }

            }

          }

        })

  }

  var planetCreator = function (star, system) {

    var newPlanet = geddy.model.Planet.generate(star);
        system.addPlanet(newPlanet);
        newPlanet.save(function (err, data) {

          if (err) {

            geddy.log.error(err);

          }

        })

  }

  var newSector = sectorCreator(sectorProperties, systemCreator, starCreator, planetCreator);
  

  /*var sector = geddy.model.Sector.create(sectorProperties);
  sector.save(function (err, data) {
    
    if (err) {

      geddy.log.error(err);

    } else {

      for (var width = 0; width < 100; width++) {

        for (var height = 0; height < 100; height++) {
          
          var systemCheck = Math.random();
          
          if (systemCheck <= sector.density) {
            
            geddy.model.System.generate(width, height, function (newSystem) {

              newSystem.save(function (err, data) {
              
                if (err) {

                  geddy.log.error(err);

                } else {

                  sector.save(function (err, data) {

                    sector.addSystem(newSystem);
                    sector.save(function (err, data) {

                      if (err) {

                        geddy.log.error(err);

                      } else {

                        geddy.model.Star.generate(newSystem, function (newStar) {

                          newStar.save(function (err, data) {

                            if (err) {

                              geddy.log.error(err);

                            } else {

                              newSystem.addStar(newStar);
                              newSystem.save(function (err, data) {

                                if (err) {

                                  geddy.log.error(err);

                                } else {

                                  var planetCount = Math.round(Math.random() * 10);

                                  if (planetCount <= 10) {
                                    
                                    for (var i = 0; i < planetCount; i++) {
                                      
                                      geddy.model.Planet.generate(newSystem, newStar, function (newPlanet) {

                                        newPlanet.save(function (err, data) {

                                          if (err) {

                                            geddy.log.error(err);

                                          } else {

                                            newSystem.addPlanet(newPlanet);
                                            newSystem.save(function (err, data) {

                                              if (err) {

                                                geddy.log.error(err);

                                              }

                                            })

                                          }

                                        })

                                      });
                                      
                                    }

                                  }
                                }

                              })

                            }

                          });

                        });

                      }

                    })

                  })
                  
                }

              })

            });

          }

        }
      }

    }

  })*/

}

exports.Sector = Sector;

