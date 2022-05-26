const path = require("path");
const http = require("http");
const express = require("express");
const {Server} = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const Filter = require("bad-words");
const { generateMessage } = require("./utils/generateMessage");
const { addUser, removeUser, getUser, getUsersInRoom} = require('./utils/users')


// let count = 0;
const port = process.env.PORT || 3000;

const publicDirectoryPath = path.join(__dirname, "../public");
app.use(express.static(publicDirectoryPath));

const message = "Welcome!";


io.on("connection", (socket) => {

  socket.on('join',({username, room},callback)=>{

    const {error, user} = addUser({id:socket.id, username, room})
    if(error){
      return callback(error)
    }
    socket.join(user.room);

    socket.emit("message", generateMessage('Admin',message));

  socket.broadcast.to(user.room).emit("message", generateMessage('Admin',`${user.username} has joined!`))

  io.to(user.room).emit("roomData", {
    room: user.room,
    users: getUsersInRoom(user.room)
  })
   callback();
  })

  socket.on("chat", (input,callback) => {
    const user = getUser(socket.id);

    const filter = new Filter();
    if(filter.isProfane(input)){
      return  callback("Profanity is not allowed!");
    }
    
    console.log(`>> ${input}`);
    io.to(user.room).emit("message", generateMessage(user.username,input));

    callback()

  });

  socket.on("sendLocation", (pos, callback)=>{
    const user = getUser(socket.id)
    const locationString = `https://google.com/maps?q=${pos.lat},${pos.long}`;
    
    io.to(user.room).emit("location", generateMessage(user.username,locationString));

    callback();
  })



  socket.on("disconnect",()=>{
    const user = removeUser(socket.id) 
    if(user){
      io.to(user.room).emit("message", generateMessage('Admin',`${user.username} has left!`))
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room)
      })
    }
  })


  
});



server.listen(port, () => {
  console.log(`Listning through port ${port}`);
});
