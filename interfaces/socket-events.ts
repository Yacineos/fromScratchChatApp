export interface ServerToClientEvents {
    noArg: () => void;
    basicEmit: (a: number, b: string, c: Buffer) => void;
    withAck: (d: string, callback: (e: number) => void) => void;
    userJoined: (message: string) => void ;
    message: (message:string) => void;
    left: (message: string)=> void;
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
