import { Server } from "socket.io";
import { createServer } from "http";

interface ServerToClientEvents {
    noArg: () => void;
    basicEmit: (a: number, b: string, c: Buffer) => void;
    withAck: (d: string, callback: (e: number) => void) => void;
    userJoined: (message: string) => void ;
}

interface ClientToServerEvents {
    hello: () => void;
    joinRoom: (username: string , room :string) => void;
}

interface InterServerEvents {
    ping: () => void;
}

interface SocketData {
    username: string;
    room: string;
}
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
    console.log(">"+socket.id+" is just connected ");
    socket.on("joinRoom", ( username, room ) => {
        console.log(">"+username+" joined the room : "+room);
        socket.data.username = username;
        socket.data.room = room;
        
        socket.join(room);
        socket.to(room).emit('userJoined', `${username} has joined the room.`);
    });
});
  
io.listen(3000);
console.log("Socket.IO server running on port 3000");