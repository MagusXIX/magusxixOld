var geddy = {};
window.geddy = geddy || {};
geddy.io = require('socket.io-client');
geddy.socket = geddy.io.connect('/');

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

    event.preventDefault();
    geddy.socket.emit('sentMessage', $('#messageFormInput').val());

    $('#sentMessages').append("<div class='sentMessage' style='margin-bottom: 1px; word-wrap: break-word'>" + "<p class='sentMessageText'>" + $('#messageFormInput').val() + "</p></div>");
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

  event.preventDefault();
  geddy.socket.emit('sentMessage', $('#messageFormInput').val());

  $('#sentMessages').append("<div class='sentMessage' style='margin-bottom: 1px; word-wrap: break-word'>" + $('#messageFormInput').val() + "</div>");
  $('#messageFormInput').val('');
  $('#messageFormInput').focus();

  messageCount++;

  if ((messageCount * 20) > $("#sentMessages").height()) {
    $("#sentMessages").scrollTop(messageCount * 20);
  }

})

geddy.socket.on('receivedMessage', function (data) {
  console.log(data);
  $('#sentMessages').append("<div class='sentMessage'>" + data + "</div>");
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
    resultsMessage = 'You rolled ' + (rollResults.length + 1) + ', ' + $('#diceSides').val() + ' sided dice to ' + $('#actionInput').val() + ' and the results were: ' + rollResults;

    $('#sentMessages').append("<div class='sentMessage' style='margin-bottom: 1px; word-wrap: break-word'>" + resultsMessage + "</div>");
    geddy.socket.emit('diceRoll', resultsMessage);

  }

  rollTheDice(displayResults);

});

geddy.socket.on('diceRollEmit', function (data) {
  console.log(data);
  $('#sentMessages').append("<div class='sentMessage'>" + data + "</div>");
});

geddy.socket.on('establishing', function (data) {
  console.log(data);
  geddy.socket.emit('established', {established: 'true'});
});