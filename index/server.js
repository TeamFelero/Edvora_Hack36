import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('a user connected:', socket.id);

  socket.on('set username', (username) => {
    socket.username = username;
  });

  socket.on('chat message', (msg) => {
    const messageWithUser = {
      username: socket.username || 'Anonymous',
      text: msg
    };
    io.emit('chat message', messageWithUser);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
