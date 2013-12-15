geddy.io = require('socket.io').listen(geddy.server, {'log level': 0});

var connectedUsers = [];

geddy.io.sockets.on('connection', function (socket) {

  socket.emit('establishing', {established: 'true'});
  socket.on('established', function (data) {
    console.log(data);
  })

  socket.on('userConnected', function (data) {
    geddy.log.notice("User Connected.");
    connectedUsers.push(data);
    socket.broadcast.emit('updatedUsers', connectedUsers);
    socket.emit('userUpdateRebound', connectedUsers);
  })

  socket.on('sentMessage', function (data) {
  	console.log(data);
  	socket.broadcast.emit('receivedMessage', data);
  })

  socket.on('diceRoll', function (data) {
  	socket.broadcast.emit('diceRollEmit', data);
  })

  socket.on('disconnect', function () {
    geddy.log.notice("User disconnected.");
    socket.broadcast.emit('userDisconnect');
    connectedUsers.length = 0;
  })

  socket.on('userCheckUp', function (data) {
    geddy.log.notice("Reconstructing Userlist.");
    connectedUsers.push(data);
    socket.emit('userRefresh', connectedUsers);
  })

})