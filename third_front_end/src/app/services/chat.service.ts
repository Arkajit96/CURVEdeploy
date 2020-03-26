import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';
import { Observable, fromEvent } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

    private url = this.config.getURL();
    private socket;   
    private isConnected = false; 
    public userToMessage = null;

    constructor(
      private http: HttpClient,
      private config: ConfigService
    ) {
        // this.socket = io(this.url);
    }

    getIsConnected() {
      return this.isConnected;
    }

    connectToSocket(userid) {
      this.socket = io(this.url);
      let room = 'room' + userid + '';
      this.socket.emit('join', room, (error) => {
        if(error) {
          console.log(error);
        } else {
          // console.log(this.socket);
        }
      })
      this.isConnected = true;
    }

    storeUserToMessage(user) {
      this.userToMessage = user;
    }

    getUserToMessage() {
      return this.userToMessage;
    }

    getMessages(userid) {
      let observable = new Observable<any>(observer => {
        this.socket = io(this.url);
        let room = 'room' + userid + '';
        this.socket.emit('join', room, (error) => {
          this.socket.on('new-message', (data) => {
            observer.next(data);    
          });
        });
        return () => {
          this.socket.disconnect();
        };  
      })     
      return observable;
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

   loadMessages(senderId, recipientId): Promise<any> {
    return new Promise((res, rej) => {
      this.http.post(this.url + 'message/getMessages', {senderId, recipientId}).subscribe(
        data => {
          // console.log(data);
          res(data);
        },
        error => {
          console.log(error);
          rej(error);
        }
      )
    })
   }

   sendMessage(senderId, recipientId, text): Promise<any> {
     return new Promise((res, rej) => {
       this.http.post(this.url + 'message/sendMessage', {
         senderId: senderId,
         recipientId: recipientId,
         text: text
       }).subscribe(
         data => {
           this.socket.emit('send-message', data);
           res(data);
         },
         error => {
           rej(error);
         }
       )
     })
   }

   loadUnreadMessages(userid): Promise<any> {
     return new Promise((res, rej) => {
       this.http.get(this.url + 'message/unreadMessages/' + userid).subscribe(
         data => {
            res(data);
         },
         error => {
           rej(error);
         }
       )
     })
   }

   readMessage(userid, messageid) {
     let form = {
       userId: userid,
       messageId: messageid
     }
     this.http.post(this.url + 'message/readMessage', form).subscribe(
       data => {
        //  console.log(data);
       },
       error => {
         console.log(error);
       }
     )
   }

   searchFaculty(query): Promise<any> {
     return new Promise((res, rej) => {
       this.http.get(this.url + 'message/searchFaculty/' + query).subscribe(
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
