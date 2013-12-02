var modelCache = {}
var sector = {

  load: function (x, y, callback) {
  	if (modelCache[x+','+y]) return callback(modelCache[x+','+y])
    $.getJSON('/sector/load/' + x + '/' + y, function (sector) {
      modelCache[x+','+y] = sector;
      callback(sector)
    });
  }

};

module.exports = sector;