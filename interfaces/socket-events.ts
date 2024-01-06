import {User, UserMessage} from "./user";
export interface ServerToClientEvents {
    userJoined: (message: string) => void ;
    message: (userMessage : UserMessage) => void;
    left: (message: string)=> void;
    usersList: (usersList:User[]) => void ;
  }
  
export interface ClientToServerEvents {
    message: (message:string) => void;
    joinRoom: (username: string , room :string) => void;
    left: (usenrame: string) => void ;
  }
export interface InterServerEvents {
    ping: () => void;
}

export interface SocketData {
    username: string;
    room: string;
    usersList: string[];
}
