var star = {

    load: function (id, callback) {
      $.getJSON('/star/load/' + id, callback);
    }

};

module.exports = star;