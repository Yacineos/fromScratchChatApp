import { Component, ElementRef, ViewChild } from '@angular/core';
import { SocketService } from '../socket.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {User, UserMessage} from '../../../../interfaces/user';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  
  @ViewChild("scrollMe") private myScroller! : ElementRef ;
  
  
  messageInput! : string ;
  messages: UserMessage[] = [];
  usersList : User[] = [];
  private userJoinedSubscription!: Subscription ;
  private userListSubscription!: Subscription;
  private messageSubscription!: Subscription;



  constructor(private socketService: SocketService, private router: Router){
  }

  
  ngOnInit(): void {

    this.scrollToBottom();


    const currentUser = sessionStorage.getItem('username')?? " ";
    const room = sessionStorage.getItem('room');

    if(currentUser && room){
      this.socketService.userJoinRoom(currentUser,room);
    }else{
      this.router.navigate(['/']);
    }

    this.userListSubscription = this.socketService.usersList$.subscribe(usersList => {
      this.usersList = usersList;
    })


    this.messageSubscription = this.socketService.message$.subscribe((userMessage) => { 
      userMessage.currentUser = userMessage.username === currentUser;

      this.messages.push(userMessage)
      //this.messages.push(message.currentUser);
      //this.messages.push(message.message);
    })

  }


  ngAfterViewChecked() {        
    this.scrollToBottom();        
  } 

  ngOnDestroy(){
    this.userListSubscription.unsubscribe();
    this.messageSubscription.unsubscribe();
  }
  sendMessage(){
    this.socketService.sendMessage(this.messageInput);
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

  scrollToBottom(): void {
    try {
      this.myScroller.nativeElement.scrollTop = this.myScroller.nativeElement.scrollHeight;
    } catch(err) { } 
  }

}
