const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  
  socket.on('set username', (data) => {
    socket.username = data;
    console.log("works!")
    socket.join('default')
  });

  socket.on('chat message', (msg) => {
    io.emit('chat message', `${socket.username}: ${msg}`);
  });

  socket.on('disconnect', () => {
    socket.to('default').emit('chat message', `${username} has left the room`);
  });

  socket.on('join room', (room) => {
    socket.join(room);
    io.emit('chat message', `${socket.username} has joined room ${room}`);
  });

  socket.on('leave room', (room) => {
    socket.leave(room);
    io.emit('chat message', `${socket.username} has left room ${room}`);
  });
});



http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
