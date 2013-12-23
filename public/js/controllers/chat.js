console.log("inside chat.js");

var geddy = {};
window.geddy = geddy || {};
geddy.io = require('socket.io-client');
geddy.socket = geddy.io.connect('/');

var userName = readCookie('userName');
var allUsers = [];
geddy.socket.emit('userConnected', userName);
geddy.socket.on('updatedUsers', function (data) {
  $('.connectedUser').remove();
  allUsers.length = 0;
  for (var i in data) {
    var individual = data[i].replace(/<(?:.|\n)*?>/gm, '');
    $('#userListCan').append("<div class='connectedUser'>" + individual + "</div>")
    allUsers.push(data[i]);
  }
})
geddy.socket.on('userUpdateRebound', function (data) {
  $('.connectedUser').remove();
  allUsers.length = 0;
  for (var i in data) {
    var individual = data[i].replace(/<(?:.|\n)*?>/gm, '');
    $('#userListCan').append("<div class='connectedUser'>" + individual + "</div>")
    allUsers.push(data[i]);
  }
})

geddy.socket.on('userDisconnect', function () {
  console.log("User disconnected.");
  geddy.socket.emit('userCheckUp', userName);
})

geddy.socket.on('userRefresh', function (data) {
  console.log("Refreshing users.");
  $('.connectedUser').remove();
  allUsers.length = 0;
  for (var i in data) {
    var individual = data[i].replace(/<(?:.|\n)*?>/gm, '');
    $('#userListCan').append("<div class='connectedUser'>" + individual + "</div>")
    allUsers.push(individual);
  }
})

$('html').css("height", "100%");
$('html').css("width", "100%");
$('body').css("height", "100%");
$('body').css("width", "100%");
$('#container').css("height", "100%");
$('#container').css("width", "100%");

$("#headerText").click(function () {
  window.open("/");
})

//UTILITY CAN MANAGERS

$('#diceRollerCan').hide();

$('#userNavButton').click(function () {
  $('#userNavButton').removeClass("utilityNavButtonBorder");
  $('#diceNavButton').addClass("utilityNavButtonBorder");
  $('#userListCan').show();
  $('#diceRollerCan').hide();
})

$('#diceNavButton').click(function () {
  $('#userNavButton').addClass("utilityNavButtonBorder");
  $('#diceNavButton').removeClass("utilityNavButtonBorder");
  $('#userListCan').hide();
  $('#diceRollerCan').show();
})

//MESSAGE HANDLERS
var messageCount = 0;

var autoScroll = function () {
  messageCount++;

  if ((messageCount * 1000) > $("#sentMessages").height()) {
    $("#sentMessages").scrollTop(messageCount * 1000);
  }

  if ((messageCount * 1000) > $("#rolledDice").height()) {
    $("#rolledDice").scrollTop(messageCount * 1000);
  }

}

$('#messageFormInput').keypress(function (event) {

  if (event.which == 13) {

    var inputText = $('#messageFormInput').val().replace(/<(?:.|\n)*?>/gm, '');
    var sentMessage = [];
    sentMessage.push(userName, inputText);

    event.preventDefault();
    geddy.socket.emit('sentMessage', sentMessage);

    $('#sentMessages').append("<div class='sentMessage' style='word-wrap: break-word'><div class='sentMessageUserName'><b>" + userName + "</b></div><div class='sentMessageText'>" + inputText + "</div><div class='clear'></div></div>");
    $('#messageFormInput').val('');
    $('#messageFormInput').focus();

    if ($('#sentMessages').width() > $('#mainChatCan').width()) {
      $('#sentMessages').width = $('#mainChatCan').width();
    }

    autoScroll();

  }

});

$('#messageFormSubmit').click(function (event) {

  var inputText = $('#messageFormInput').val().replace(/<(?:.|\n)*?>/gm, '');
  var sentMessage = [];
  sentMessage.push(userName, inputText);

  event.preventDefault();
  geddy.socket.emit('sentMessage', sentMessage);

  $('#sentMessages').append("<div class='sentMessage' style='word-wrap: break-word'><div class='sentMessageUserName'><b>" + userName + "</b></div><div class='sentMessageText'>" + inputText + "</div><div class='clear'></div></div>");
  $('#messageFormInput').val('');
  $('#messageFormInput').focus();

  if ($('#sentMessages').width() > $('#mainChatCan').width()) {
    $('#sentMessages').width = $('#mainChatCan').width();
  }

  autoScroll();

})

geddy.socket.on('receivedMessage', function (data) {
  $('#sentMessages').append("<div class='sentMessage' style='word-wrap: break-word'><div class='sentMessageUserName'><b>" + data[0] + "</b></div><div class='sentMessageText'>" + data[1] + "</div><div class='clear'></div></div>");

  if ($('#sentMessages').width() > $('#mainChatCan').width()) {
    $('#sentMessages').width = $('#mainChatCan').width();
  }

  autoScroll();

})


//DICE HANDLERS
$('#actionInput').keypress(function (event) {
  if (event.which == 13) {
    event.preventDefault();
  }
})

$('#diceNumber').keypress(function (event) {
  if (event.which == 13) {
    event.preventDefault();
  }
})

$('#diceSides').keypress(function (event) {
  if (event.which == 13) {
    event.preventDefault();
  }
})

$('#diceFormSubmit').click(function (event) {

  event.preventDefault();

  var rollTheDice = function (callback) {
    var rollResults = [];

    for (var i = 1; i <= $('#diceNumber').val(); i++) {
      var result = Math.floor((Math.random() * $('#diceSides').val()) + 1);
      rollResults.push(result);
    }

    callback(rollResults);
  }

  var displayResults = function (rollResults) {

    var action = $('#actionInput').val().replace(/<(?:.|\n)*?>/gm, '');

    var resultsMessage = '';
    resultsMessage = '<b>' + userName + '</b> rolled ' + (rollResults.length) + ', ' + $('#diceSides').val() + ' sided dice to ' + action + ' and the results were: ' + rollResults;

    $('#rolledDice').append("<div class='sentMessage' style='margin-bottom: 1px; word-wrap: break-word'>" + resultsMessage + "</div>");
    geddy.socket.emit('diceRoll', resultsMessage);

    if ($('#rolledDice').width() > $('#diceRollerCan').width()) {
      $('#rolledDice').width = $('#diceRollerCan').width();
    }

    autoScroll();

  }

  if ($('#diceNumber').val() == parseInt($('#diceNumber').val())) {
    if ($('#diceSides').val() == parseInt($('#diceSides').val())) {
      if ($('#diceNumber').val() <= 20 && ($('#diceNumber').val() >= 1)) {

        rollTheDice(displayResults);

      } else {

        $('#rolledDice').append("<div class='sentMessage' style='margin-bottom: 1px; word-wrap: break-word'>You may only roll up to 20 dice at once. No negative numbers.</div>");

      }

    } else {

      $('#rolledDice').append("<div class='sentMessage' style='margin-bottom: 1px; word-wrap: break-word'>The number of sides must be a valid number.</div>");

    }

  } else {

    $('#rolledDice').append("<div class='sentMessage' style='margin-bottom: 1px; word-wrap: break-word'>The number of dice must be a valid number.</div>");

  }

});

geddy.socket.on('diceRollEmit', function (data) {
  $('#rolledDice').append("<div class='sentMessage'>" + data + "</div>");
});

geddy.socket.on('establishing', function (data) {
  geddy.socket.emit('established', {established: 'true'});
});

//COOKIE HANDLERS
function createCookie(name,value,days) {
  if (days) {
    var date = new Date();
    date.setTime(date.getTime()+(days*24*60*60*1000));
    var expires = "; expires="+date.toGMTString();
  }
  else var expires = "";
  document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}

function eraseCookie(name) {
  createCookie(name,"",-1);
}