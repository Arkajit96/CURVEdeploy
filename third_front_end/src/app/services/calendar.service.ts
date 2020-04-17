import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


// Service
import { ConfigService } from './config.service';

@Injectable({ providedIn: 'root' })
export class CalendarService {

    constructor(
        private http: HttpClient,
        private router: Router,
        private config: ConfigService,
    ) { }

    private url = this.config.getURL();

    googleOath(){
        this.http.get<{ message: string, url: string}>(
            this.url + 'calendar/googleOath/'
        ).toPromise().then(
            data => {
                window.location.href = data.url;
            },
            error => {
                console.log(error);
            }
        )
    }

    getGoogleEvents(code: string): Promise<any> {
        let data = {
            code: code,
          }

        this.http.post(this.url + 'calendar/getGoogleEvents', data).subscribe(
          data => {
            console.log(data);
          },
          err => {
            console.log(err);
          }
        )

        return new Promise((res, rej) => {
            this.http.post<{ message: string; events: any}>(
              this.url + 'calendar/getGoogleEvents', data
              ).toPromise().then(
              data => {
                console.log(data);
                res(data.events);
              },
              error => {
                console.log(error);
                res(error);
              }
            )
          })
    }
}