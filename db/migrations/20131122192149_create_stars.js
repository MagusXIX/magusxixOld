var CreateStars = function () {
  this.up = function (next) {
    var def = function (t) {
          t.column('', '');
        }
      , callback = function (err, data) {
          if (err) {
            throw err;
          }
          else {
            next();
          }
        };
    this.createTable('star', def, callback);
  };

  this.down = function (next) {
    var callback = function (err, data) {
          if (err) {
            throw err;
          }
          else {
            next();
          }
        };
    this.dropTable('star', callback);
  };
};

exports.CreateStars = CreateStars;
