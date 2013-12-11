geddy.io = require('socket.io').listen(geddy.server, {'log level': 0});

geddy.io.sockets.on('connection', function (socket) {
  socket.emit('establishing', {established: 'true'});
  socket.on('established', function (data) {
    console.log(data);
  })
  socket.on('sentMessage', function (data) {
  	console.log(data);
  	socket.broadcast.emit('receivedMessage', data)
  })
})