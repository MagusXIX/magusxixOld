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

geddy.socket.on('establishing', function (data) {
  console.log(data);
  geddy.socket.emit('established', {established: 'true'});
});