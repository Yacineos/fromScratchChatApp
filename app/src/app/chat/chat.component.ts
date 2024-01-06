import { Component } from '@angular/core';
import { SocketService } from '../socket.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {User} from '../../../../interfaces/user';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  message! : string ;
  messages: string[];
  usersList : User[] = [];
  private userJoinedSubscription!: Subscription ;
  private userListSubscription!: Subscription;
  constructor(private socketService: SocketService, private router: Router){
    this.messages = [];
  }

  
  ngOnInit(): void {
    const username = sessionStorage.getItem('username');
    const room = sessionStorage.getItem('room');

    if(username && room){
      this.socketService.userJoinRoom(username,room);
    }else{
      this.router.navigate(['/']);
    }

    this.userListSubscription = this.socketService.usersList$.subscribe(usersList => {
      this.usersList = usersList;
    })


  }

  ngOnDestroy(){
    this.userListSubscription.unsubscribe();
  }
  sendMessage(){
    this.socketService.sendMessage(this.message);
  }
  
  //function called when the disconnect button is clicked 
  // call the disconnect method of the service
  // clear the session storage 
  // and return to the login home 
  disconnect(){
    this.socketService.disconnect(sessionStorage.getItem('username')??"");
    sessionStorage.clear();
    this.router.navigate(['/']);
  }

}
