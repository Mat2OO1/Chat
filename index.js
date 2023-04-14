const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  let room;

  socket.on('set username', (username) => {
    socket.username = username
    io.emit('chat message', `${socket.username} joined the chat `)
  });

  socket.on('join room', (joinedRoom) => {
    socket.join(joinedRoom);
    room = joinedRoom;
    io.to(room).emit('chat message', `${socket.username} joined the room`);
  });

  socket.on('chat message', (msg) => {
    io.to(room).emit('chat message', `${socket.username}: ${msg}`);
  });

  socket.on('leave room', () => {
    io.to(room).emit('chat message', `${socket.username} left the room`);
    socket.leave(room);
  });

  socket.on('disconnect', () => {
    io.to(room).emit('chat message', `${socket.username} left the room`);
  });
});




http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
