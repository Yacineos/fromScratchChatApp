
/*
  this server will provide the necessary function to :
    - join a room 
    - send messages to all clients connected to that room
    - receives messages when connected to a room
    - knowing who is typing (optional)
    - list of all connected users (optional)
    - who joined the room (optional)
    - who left (optional)
    */

import { Server } from "socket.io";
import { createServer } from "http";
import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData } from './../interfaces/socket-events';
const httpServer = createServer();

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(httpServer, {
    cors: {
      origin: "http://localhost:4200"
    }}
);


//when a new client connects 
io.on("connection", (socket) => {
    //log the connected user id
    console.log(">"+socket.id+" is just connected ");
    /*
        *join room event if a user joins a room
            -we will log his username and the room name 
            -save those entrise in the socket.data object
            -makes him join the room
            - emit a message to all other users in the room 
            to notify them that a new user has entered the room
    */
    socket.on("joinRoom", ( username, room ) => {
        console.log(">"+username+" joined the room : "+room);
        socket.data.username = username;
        socket.data.room = room;

        //join a room 
        socket.join(room);


        


        io.in(room).emit('userJoined', `${username} has joined the room.`);
    });

    // if the current user send a message we diffuse it to the rooom
    socket.on("message",(message) =>{
        console.log("the user "+socket.data.username +" said : "+message +" to the room :"+ socket.data.room);
        socket.to(socket.data.room).emit("message",""+message);
    })

    //if user disconnect -> inform all others in the room
    socket.on("left",(username) => {
        console.log("the user "+username+" left the room "+socket.data.room);
        socket.to(socket.data.room).emit("left" , "the user "+username+"left the room");
    });

});
  
io.listen(3000);
console.log("Socket.IO server running on port 3000");