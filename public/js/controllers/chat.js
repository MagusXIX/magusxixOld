var geddy = {};
window.geddy = geddy || {};
geddy.io = require('socket.io-client');
geddy.socket = geddy.io.connect('/');
console.log(geddy.socket);

geddy.socket.on('news', function (data) {
  console.log(data);
  geddy.socket.emit('my other event', {my: 'data'});
});