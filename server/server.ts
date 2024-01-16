
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
import { User, UserMessage } from '../interfaces/user';

const httpServer = createServer();

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(httpServer, {
    cors: {
      origin: "*",
      allowedHeaders:"*"
    }}
);

// state 
const UsersState = {
    users: [] as User[],
    setUsers: function (newUsersArray: User[]) {
        this.users = newUsersArray
    }
}


//when a new client connects 
io.on("connection", (socket) => {
    //log the connected user id
    console.log(">"+socket.id+" is just connected ");
    /*
        *join room event if a user joins a room
            -we will log his username and the room name 
            - activate user ( update current users array)
            -makes him join the room
            - emit a message to all other users in the room 
            to notify them that a new user has entered the room
    */
    socket.on("joinRoom", ( username, room ) => {
        // log user 
        console.log(">"+username+" joined the room : "+room);
        const user = activateUser(socket.id , username , room );
        printUsersList();

        //join a room 
        socket.join(room);

        socket.broadcast.to(room).emit('userJoined', user.name);

        io.to(room).emit('usersList',getUsersInRoom(room));
    });

    // if the current user send a message we diffuse it to the rooom
    socket.on("message",(message) =>{
        const user = getUser(socket.id);
        if(user){
            console.log("the user said : "+message +" to the room ");
            let userMessage : UserMessage = {message : message, username : user.name , currentUser:false};

            io.to(user.room).emit("message", userMessage);
        }
    })

    //if user disconnect -> inform all others in the room
    socket.on("left",(username) => {
        const user = getUser(socket.id);
        userLeavesApp(socket.id);

        if(user){
            // send the username of the user who left 
            io.to(user.room).emit("left" , "the user "+username+"left the room");

            // send the new userList to everyone in the room
            io.to(user.room).emit('usersList',getUsersInRoom(user.room));
        }
        
    });

});

/*
    a function to look for a similar id in the users list ,
    if it exist we exclude the existing one , and add the new one to avoid repetition
*/
function activateUser(id: string ,name: string ,room:string): User{
    const newUser = {id , name, room};

    UsersState.setUsers([
        ...UsersState.users.filter(user => (user.id !== id && user.name!==name)), newUser
    ]);
    return newUser ;
}

function printUsersList(): void{
    console.log("current users list : ")
    UsersState.users.forEach(element => {
        console.log("> "+element.name);
    });
}

function userLeavesApp(id: string): void{
    UsersState.setUsers(
        UsersState.users.filter(user => user.id !== id)
    );
    printUsersList();
}

function getUser(id: string): User | undefined{
    return UsersState.users.find(user => user.id === id);
}

function getUsersInRoom(room:string): User[] {
    return UsersState.users.filter(user => user.room === room);
}




io.listen(3000);
console.log("Socket.IO server running on port 3000");