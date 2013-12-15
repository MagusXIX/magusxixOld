console.log("inside chat.js");

var geddy = {};
window.geddy = geddy || {};
geddy.io = require('socket.io-client');
geddy.socket = geddy.io.connect('/');

var userName = readCookie('userName');
console.log(userName);

$('html').css("height", "100%");
$('html').css("width", "100%");
$('body').css("height", "100%");
$('body').css("width", "100%");
$('#container').css("height", "100%");
$('#container').css("width", "100%");

//MESSAGE HANDLERS
var messageCount = 0;

$('#messageFormInput').keypress(function (event) {

  if (event.which == 13) {

    var inputText = encodeURI($('#messageFormInput').val());

    event.preventDefault();

    geddy.socket.emit('sentMessage', inputText);

    $('#sentMessages').append("<div class='sentMessage' style='margin-bottom: 1px; word-wrap: break-word'><p class='sentMessageText'>" + inputText + "</p></div>");
    $('#messageFormInput').val('');

    messageCount++;

    if ((messageCount * 20) > $("#sentMessages").height()) {
      $("#sentMessages").scrollTop(messageCount * 20);
    }

    if ($('#sentMessages').width() > $('#mainChatCan').width()) {
      $('#sentMessages').width = $('#mainChatCan').width();
    }

  }

});

$('#messageFormSubmit').click(function (event) {

  var inputText = encodeURI($('#messageFormInput').val());

  event.preventDefault();
  geddy.socket.emit('sentMessage', inputText);

  $('#sentMessages').append("<div class='sentMessage' style='margin-bottom: 1px; word-wrap: break-word'>" + "<p class='sentMessageText'>" + inputText + "</p></div>");
  $('#messageFormInput').val('');
  $('#messageFormInput').focus();

  messageCount++;

  if ((messageCount * 20) > $("#sentMessages").height()) {
    $("#sentMessages").scrollTop(messageCount * 20);
  }

})

geddy.socket.on('receivedMessage', function (data) {
  $('#sentMessages').append("<div class='sentMessage' style='margin-bottom: 1px; word-wrap: break-word'>" + "<p class='sentMessageText'>" + data + "</p></div>");
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

    var resultsMessage = '';
    resultsMessage = 'You rolled ' + (rollResults.length) + ', ' + $('#diceSides').val() + ' sided dice to ' + $('#actionInput').val() + ' and the results were: ' + rollResults;

    $('#sentMessages').append("<div class='sentMessage' style='margin-bottom: 1px; word-wrap: break-word'>" + resultsMessage + "</div>");
    geddy.socket.emit('diceRoll', resultsMessage);

    messageCount++;

    if ((messageCount * 20) > $("#sentMessages").height()) {
      $("#sentMessages").scrollTop(messageCount * 20);
    }

    if ($('#sentMessages').width() > $('#mainChatCan').width()) {
      $('#sentMessages').width = $('#mainChatCan').width();
    }

  }

  rollTheDice(displayResults);

});

geddy.socket.on('diceRollEmit', function (data) {
  $('#sentMessages').append("<div class='sentMessage'>" + data + "</div>");
});

geddy.socket.on('establishing', function (data) {
  console.log(data);
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