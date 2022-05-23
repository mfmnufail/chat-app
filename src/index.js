const path = require("path");
const http = require("http");
const express = require("express");
const {Server} = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// let count = 0;
const port = process.env.PORT || 3000;

const publicDirectoryPath = path.join(__dirname, "../public");
app.use(express.static(publicDirectoryPath));

const message = "Welcome!";
let cht = null;

io.on("connection", (socket) => {
  socket.emit("message", message);

  socket.broadcast.emit("message", "A new user has joined!")

  socket.on("chat", (input) => {
    console.log(`>> ${input}`);
    io.emit("message", input);
  });

  socket.on("sendLocation", (pos)=>{
    io.emit("message",`https://google.com/maps?q=${pos.lat},${pos.long}`);
  })


  socket.on("disconnect",()=>{
    io.emit("message", "A user has left!")
  })
});



server.listen(port, () => {
  console.log(`Listning through port ${port}`);
});
