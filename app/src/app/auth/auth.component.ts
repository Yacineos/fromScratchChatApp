import { Component } from '@angular/core';
import { SocketService } from '../socket.service';
import { Router } from '@angular/router'
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent {

  public username! : string ;
  public room! : string ;

  constructor(private socketService: SocketService , private router: Router){
    this.room = "";
    this.username = "";
  }

  ngOnInit(): void {
  }
  

  joinRoom(){
  sessionStorage.setItem('username', this.username);
  sessionStorage.setItem('room', this.room);

    //this.socketService.userJoinRoom(this.username,this.room);
    
    this.router.navigate(['/chat']);
  }

}
