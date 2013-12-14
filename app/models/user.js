var User = function () {

  this.defineProperties({
      name: {type: 'string'}
    , password: {type: 'string'}
  });

};

User.generate = function (name, password) {

  var userProperties = {
      name: name
    , password: password
  }

  console.log(userProperties);

  var user = geddy.model.User.create(userProperties);
  
  user.save(function (err, data) {

    if (err) {
      geddy.log.error(err);
    } else {
    }

  })

}

exports.User = User;