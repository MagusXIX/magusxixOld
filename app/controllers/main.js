/*
 * Geddy JavaScript Web development framework
 * Copyright 2112 Matthew Eernisse (mde@fleegix.org)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
*/

var js = require('atomify-js');
var path = require('path');

var Main = function () {

  this.index = function (req, resp, params) {
    this.respond({params: params}, {
        format: 'html'
      , template: 'app/views/main/index'
    });
  };

  this.projects = function (req, resp, params) {
    this.respond({params: params}, {
        format: 'html'
      , template: 'app/views/main/projects'
    })
  };

  this.playground = function (req, resp, params) {
    this.respond({params: params}, {
        format: 'html'
      , template: 'app/views/main/playground'
    })
  };

  this.sectorMap = function (req, resp, params) {
    this.respond({params: params}, {
        format: 'html'
      , template: 'app/views/main/sectormap'
    });
  };

  this.chat = function (req, resp, params) {
    var self = this;
    geddy.log.notice('Directing to chat.');

    if (params.matched == "true") {
      this.respond({params: params}, {
          format: 'html'
        , template: 'app/views/main/chat'
      })
    } else {
      geddy.log.error("User not matched.");
      self.chatLogIn(req, resp, params);
    }
  }

  this.chatSignUp = function (req, resp, params) {
    this.respond({params: params}, {
        format: 'html'
      , template: 'app/views/main/chat_sign_up'
    });
  };

  this.signUpNameTaken = function (req, resp, params) {
    console.log(params);
    this.respond({params: params}, {
        format: 'html'
      , template: 'app/views/main/chat_bad_sign_up'
    })
  }

  this.signUpMismatch = function (req, resp, params) {
    console.log(params);
    this.respond({params: params}, {
        format: 'html'
      , template: 'app/views/main/chat_bad_sign_up'
    });
  };

  this.signUpAttempt = function (req, resp, params) {
    var self = this;
    
    geddy.model.User.all({name: params.userName}, function (err, users) {

      if (err) {
        geddy.log.error(err);
      } else if (users) {
        console.log(users);
        
        if (users.length > 0) {

          for (var i in users) {
            geddy.log.notice('Browsing users');

            if (users[i].name == params.userName) {
              geddy.log.error('Username is Taken');

              params.nameTaken = "true";

              self.signUpNameTaken(req, resp, params);

            } else if (params.password != params.passwordConfirm) {
              geddy.log.error('Passwords do not match! Line 104');

              params.passwordMismatch = "true";
              console.log(params);

              self.signUpMismatch(req, resp, params);

            } else {
              geddy.log.notice('Sign Up Conditions Met Multple Users');

              geddy.model.User.generate(params.userName, params.password);
              params.matched = "true";
              self.chat(req, resp, params);
            }

          }

        } else {

          if (params.password != params.passwordConfirm) {
            
            geddy.log.error('Passwords do not match.');
            params.passwordMismatch = "true";
            self.signUpMismatch(req, resp, params);

          } else {
            
            geddy.log.notice("Sign Up Conditions Met.  Single User");
            geddy.model.User.generate(params.userName, params.password);
            params.matched = "true";
            self.chat(req, resp, params);

          }

        }

      }

    });

  };

  this.chatLogIn = function (req, resp, params) {
    this.respond({params: params}, {
        format: 'html'
      , template: 'app/views/main/chat_log_in'
    });
  };

  this.logInAttempt = function (req, resp, params) {
    var self = this;

    geddy.model.User.all({name: params.userName}, function (err, users) {

      if (err) {
        geddy.log.error('DB query error, no user found.')
      } else if (users.length == 0) {
        geddy.log.error("No matched user.");
        self.chatBadLogIn(req, resp, params);
      } else {

        if (users[0].password == params.password) {
          geddy.log.notice("Name and password match.");
          params.matched = "true";
          self.chat(req, resp, params);
        } else {
          geddy.log.notice("Password does not match username.");
          self.chatBadLogIn(req, resp, params);
        }

      }

    })
  }

  this.chatBadLogIn = function (req, resp, params) {
    var self = this;

    this.respond({params: params}, {
        format: 'html'
      , template: 'app/views/main/chat_bad_log_in'
    })
  }

  this.bundle = function (req, resp, params) {
    js({entry: path.join(__dirname,'/../../public/js/controllers/sectorMap.js'), debug: true}, function(err, src){
      if (err) {
        geddy.log.error("FRONT END ERROR!! OH NOAZ!" + err.message);
      }
      resp.send(src, 200, {'Content-Type': 'text/javascript'});
    });
    //resp.send('alert("done");', 200, {'Content-Type': 'text/javascript'})
  };

  this.chatBundle = function (req, resp, params) {
    geddy.log.notice("finding chat bundle.");
    js({entry: path.join(__dirname,'/../../public/js/controllers/chat.js'), debug: true}, function (err, src) {
      if (err) {
        geddy.log.error("FRONT END ERROR!! OH NOAZ!" + err.message);
      }
      geddy.log.notice("chat bundle found");
      resp.send(src, 200, {'Content-Type': 'text/javascript'});
    });
  };

};

exports.Main = Main;


