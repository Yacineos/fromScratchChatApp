import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {io , Socket} from 'socket.io-client';
import {ServerToClientEvents , ClientToServerEvents} from '../../../interfaces/socket-events';

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
  private usersListUpdate: Subject<string[]> = new Subject<string[]>();
  private message: string = " ";
  constructor() { 
    this.socket = io(this.url);
    this.setupListeners(); // Set up listeners for socket events
  }

  // Method to set up listeners for socket events
  private setupListeners(): void {
    this.socket.on("userJoined", (message: string) => {
      //this.usersListUpdate.next(usersList); // Emit updated user list
      console.log(message);
    });

    // Add other event listeners as needed
  }

  // Public method to access the usersList as an Observable
  public getUsersListUpdate(): Observable<string[]> {
    return this.usersListUpdate.asObservable();
  }


  /*
    makes the current user (username) join the room (room) if it exist 
    if it doesn't exist it will be created 
  */
  public userJoinRoom(username: string , room: string): void {
    // add the new user to the list of current users 

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
    this.socket.disconnect();
  }
  

  


}
