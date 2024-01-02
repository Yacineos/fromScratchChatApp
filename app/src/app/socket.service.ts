import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {io , Socket} from 'socket.io-client';

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


/*
  this service will provide the necessary function to :
    - join a room 
    - send messages to all clients connected to that room
    - receives messages when connected to a room
    - knowing who is typing (optional)
    - list of all connected users (optional)
    - who joined the room (optional)
    - who left (optional)
    */
export class SocketService {
  private url = 'http://localhost:3000'; // your server url
  private socket: Socket<ServerToClientEvents, ClientToServerEvents> ;
  
  constructor() { 
    this.socket = io(this.url);
  }

  public userJoinRoom(username: string , room: string): void {
      this.socket.emit("joinRoom", username , room);
  }


}
