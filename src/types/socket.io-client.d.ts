declare module 'socket.io-client' {
  export const io: (url: string, opts?: any) => Socket;
  export interface Socket {
    emit: (event: string, ...args: any[]) => Socket;
    on: (event: string, callback: (...args: any[]) => void) => Socket;
    off: (event: string) => Socket;
    disconnect: () => void;
    connected: boolean;
  }
  
  export default io;
}
