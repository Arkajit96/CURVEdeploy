import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

    private url = 'http://localhost:3000';
    private socket;   
    private isConnected = false; 

    constructor(
      private http: HttpClient
    ) {
        // this.socket = io(this.url);
    }

    getIsConnected() {
      return this.isConnected;
    }

    connectToSocket() {
      this.socket = io(this.url);
      this.isConnected = true;
    }

    loadInbox(userid):Promise<any> {
      return new Promise((res, rej) => {
        this.http.get(this.url + 'message/getInbox/' + userid).subscribe(
          data => {
            res(data);
          },
          error => {
            rej(error);
          }
        )
      })
    }
    
}
