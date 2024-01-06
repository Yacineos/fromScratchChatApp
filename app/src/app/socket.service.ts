import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {io , Socket} from 'socket.io-client';
import {ServerToClientEvents , ClientToServerEvents} from '../../../interfaces/socket-events';
import { User, UserMessage } from '../../../interfaces/user';

@Injectable({ providedIn: 'root' })
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
  private messagesSource = new Subject<UserMessage>();
  message$ = this.messagesSource.asObservable();
  private userJoinedSource = new Subject<string>();
  userJoined$ = this.userJoinedSource.asObservable();
  private usersListSource = new Subject<User[]>();
  usersList$ = this.usersListSource.asObservable();

  constructor() { 
    this.socket = io(this.url);
    
    this.socket.on('usersList', (usersList: User[]) => {
      this.usersListSource.next(usersList);
    });

    this.socket.on('message',(userMessage) => {
      this.messagesSource.next(userMessage);
    });

  }
    // Add other event listeners as needed

  /*
    makes the current user (username) join the room (room) if it exist 
    if it doesn't exist it will be created 
  */
  public userJoinRoom(username: string , room: string): void {
    // join room
    this.socket.emit("joinRoom", username , room);
  }


  /*
    sends a string @message passed into the parameter of the function 
    to all users connected to the @param room 
  */
  public sendMessage( message: string ){
    this.socket.emit("message",`${message}`)
  }

  /*
    inform other users that I disconnected
  */
  disconnect(username: string){
    this.socket.emit("left", username);
  }
  

  


}
