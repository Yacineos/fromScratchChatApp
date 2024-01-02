import { Component } from '@angular/core';
import { SocketService } from '../socket.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent {

  public username! : string ;
  public room! : string ;

  constructor(private socketService: SocketService){
    this.room = "room name";
    this.username = "userame";
  }
  

  joinRoom(){
    this.socketService.userJoinRoom(this.username,this.room);
  }

}
