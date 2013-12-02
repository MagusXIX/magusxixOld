var planet = {

    load: function (id, callback) {
      $.getJSON('/planet/load/' + id, callback);
    }

};

module.exports = planet;