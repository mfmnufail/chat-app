const path = require("path");
const http = require("http");
const express = require("express");
const {Server} = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const Filter = require("bad-words");
const { generateMessage } = require("./utils/generateMessage");
const { generateLocationMessage } = require("./utils/generateLocationMessage");

// let count = 0;
const port = process.env.PORT || 3000;

const publicDirectoryPath = path.join(__dirname, "../public");
app.use(express.static(publicDirectoryPath));

const message = "Welcome!";
let cht = null;

io.on("connection", (socket) => {
  socket.emit("message", message);

  socket.broadcast.emit("message", generateMessage("A new user has joined!"))

  socket.on("chat", (input,callback) => {
    
    const filter = new Filter();
    if(filter.isProfane(input)){
      return  callback("Profanity is not allowed!");
    }
    
    console.log(`>> ${input}`);
    io.emit("message", generateMessage(input));

    callback()

  });

  socket.on("sendLocation", (pos, callback)=>{
    const locationString = `https://google.com/maps?q=${pos.lat},${pos.long}`;
    
    io.emit("location", generateMessage(locationString));

    callback();
  })


  socket.on("disconnect",()=>{
    io.emit("message", generateMessage("A user has left!"))
  })
});



server.listen(port, () => {
  console.log(`Listning through port ${port}`);
});
