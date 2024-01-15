export interface User {
    id: string;
    name: string;
    room: string;
}

export interface UserMessage {
    username : string ;
    message : string ;
    currentUser: boolean;
}