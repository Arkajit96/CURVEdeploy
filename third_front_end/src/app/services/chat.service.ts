import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

    private url = 'http://localhost:3000';
    private socket;   
    private isConnected = false; 

    constructor() {
        // this.socket = io(this.url);
    }

    getIsConnected() {
      return this.isConnected;
    }

    connectToSocket() {
      this.socket = io(this.url);
      this.isConnected = true;
    }
    
}
