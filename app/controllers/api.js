var sector = require('../models/sector.js');

var Api = function () {

  this.respondsWith = ['json'];

  /*
  // Generation Functions
  */

  this.generateSector = function () {
    sector.Sector.generate();
    geddy.log.error('PAY ATTENTION TO ME! I AM THE SECTOR GENERATOR!');
  };

  this.loadSector = function (req, resp, params) {
    var self = this;

    var paramsPosition = [];
    paramsPosition.push(parseInt(params.x), parseInt(params.y));

    geddy.model.Sector.first({position: paramsPosition}, function (err, sector) {
      if (err) {
        geddy.log.error(err);
      }
      geddy.log.error(sector);
      self.respond(sector);
    })
  }

  /*
  // Load Functions
  */

  this.loadSystem = function (req, resp, params) {
    var self = this
      , limit = 100;

    geddy.model.Sector.first({id: params.id}, function (err, sector) {
      if (err) {
        geddy.log.error(err);
      } else {
        sector.getSystems({}, {skip: parseInt(params.page) * limit, limit: limit}, function (err, systems) {
          if (err) {
            geddy.log.error(err);
          } else {
            self.respond(systems);
          }
        })
      }
    })
  }

  this.loadStar = function (req, resp, params) {
  	var self = this;

  	geddy.model.System.first({id: params.id}, function (err, system) {
      system.getStars(function (err, stars) {
        if (err) {
          geddy.log.error(err);
        } else {
          self.respond(stars);
        }
      })
  	})
  }

  this.loadPlanet = function (req, resp, params) {
    var self = this;

    geddy.model.System.first({id: params.id}, function (err, system) {
      
      if (err) {
        geddy.log.error(err);
      } else {
        system.getPlanets(function (err, planets) {
          if (err) {
            geddy.log.error(err);
          } else {
            self.respond(planets);
          }
        })
      }

    })
  }

};

module.exports.Api = Api;