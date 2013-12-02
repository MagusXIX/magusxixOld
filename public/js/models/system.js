var modelCache = {}
var system = {

    load: function (id, callback) {
      if (modelCache[id]) return callback(modelCache[id]);
      var systems = []
      var getPage = function (page) {
        $.getJSON('/system/load/' + id + '?page=' + page, function (s) {
          for (var i in s) {
          	systems.push(s[i])
          }

          if (s.length == 100) {
            getPage(page+1)
          } else {
          	modelCache[id] = systems;
          	callback(systems)
          }

        });
      }
      getPage(0)
    }

};

module.exports = system;