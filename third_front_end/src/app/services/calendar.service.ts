import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


// Service
import { ConfigService } from './config.service';

@Injectable({ providedIn: 'root' })
export class CalendarService {

  constructor(
    private http: HttpClient,
    private config: ConfigService,
  ) { }

  private url = this.config.getURL();
  private code: string;
  private type: string;
  private userData: any;

  getCurrentUserCode() {
    return this.code;
  }

  setCurrentUserCode(newCode: string) {
    this.code = newCode;
  }

  clearCurrentUserCode() {
    this.code = null;
  }

  setType(type: string) {
    this.type = type;
    localStorage.setItem('calendarType', type);
  }

  getType() {
    return localStorage.getItem('calendarType');
    // return this.type;
  }

  setCalendarid(calendarid) {
    localStorage.setItem('calendarid', calendarid);
  }

  getCalendarid() {
    return localStorage.getItem('calendarid');
  }

  googleOath() {
    this.http.get<{ message: string, url: string }>(
      this.url + 'calendar/googleOath/'
    ).toPromise().then(
      data => {
        this.type = 'google';
        console.log(data);
        window.location.href = data.url;
      },
      error => {
        console.log(error);
      }
    )
  }

  getGoogleEvents(): Promise<any> {
    if (this.userData) {
      return new Promise((res, rej) => {
        res(this.userData);
      })
    } else {
      localStorage.removeItem('code');
      if(!this.code) {
        // this.code = localStorage.getItem('code');
      }
      let data = {code: this.code}
      console.log(data);
      // localStorage.setItem('code', data.code);

      return new Promise((res, rej) => {
        this.http.post<{ message: string; userData: any }>(
          this.url + 'calendar/getGoogleEvents', data
        ).toPromise().then(
          data => {
            console.log(data);
            this.userData = data.userData;
            let calendarid = new Date().getTime();
            this.setCalendarid(calendarid);
            let googledata = {
              calendarid: calendarid,
              events: this.userData
            }
            this.http.post(this.url + 'events/saveGoogleEvents', googledata)
              .subscribe(
                googledata => {
                  console.log(googledata);
                }
              )
            res(data.userData);
          },
          error => {
            res(error);
          }
        )
      })

    }

  }

  getCurveEvents() {
    return new Promise((res, rej) => {
      let calendarid = localStorage.getItem('userId');
      this.http.get(this.url + 'events/' + calendarid).subscribe(
        data => {
          this.userData = data;
          res(data);
        },
        error => {
          console.log(error);
          rej(error);
        }
      )
    })
  }

  microsoftSignIn() {
    return new Promise((res, rej) => {
      let headers = new HttpHeaders();
      headers = headers.set('Access-Control-Allow-Origin', '*');
      this.http.get(this.url + 'microsoft/signin', {headers: headers}).subscribe(
        data => {
          
        },
        error => {
          console.log('ERROR ', error);
        }
      )
    })
  }

  createEvent(event: any) {
    return new Promise((res, rej) => {
      console.log(event);
      let form = {
        calendarid: localStorage.getItem('userId'),
        start: {
          dateTime: event.controls.start_time.value
        },
        end: {
          dateTime: event.controls.end_time.value
        },
        summary: event.controls.event_name.value
      }
      this.http.post(this.url + 'events/create', form).subscribe(
        data => {
          console.log(data);
          res(data);
        },
        error => {
          console.log(error);
          rej(error);
        }
      )
    })
  }

}