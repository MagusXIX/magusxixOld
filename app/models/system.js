var System = function () {

  this.defineProperties({
      name: {type: 'string'}
    , strategicPosition: {type: 'object'}
  });

  this.hasMany('Stars');
  this.hasMany('Planets');

};

System.generate = function (width, height) {

  var position = [];
      position.push(width, height);

  var systemProperties = {
      name: 'Temporary'
    , strategicPosition: position
  }

  var system = geddy.model.System.create(systemProperties);
  return system;

}

exports.System = System;

