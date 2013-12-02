var Star = function () {

  this.defineProperties({
      radius: {type: 'number'}
    , starType: {type: 'string'}
    , tacticalPosition: {type: 'object'}
    , visualPosition: {type: 'object'}
  });

};

Star.generate = function () {

  var radius = Math.floor((Math.random() * (1391000000 - 300000000)) + 300000000);
  var starType = 'default';

  var tacticalPosition = [];
  tacticalPosition.push(0, 0);

  var visualPosition = [];
  visualPosition.push(0, 0);

  var starProperties = {
      radius: radius
    , starType: starType
    , tacticalPosition: tacticalPosition
    , visualPosition: visualPosition
  };

  var star = geddy.model.Star.create(starProperties);
  geddy.model.Grid.generate(star);
  return star;

};

exports.Star = Star;

