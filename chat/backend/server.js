const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "*",
    },
});

io.on("connection", (socket) => {
    console.log("What is socket: ", socket);
    console.log("Socket is active to be connected");

    socket.on("chat", (payload) => {
        console.log("What is payload", payload);
        io.emit("chat", payload)
    })
});

// app.listen(5000, () => {console.log("server is active...")});  // incorrect as socket will not work
server.listen(5000, () => {
    console.log("server is listening at port 5000...");
});