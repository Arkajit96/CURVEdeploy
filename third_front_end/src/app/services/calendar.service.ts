import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


// Service
import { ConfigService } from './config.service';

export interface State {
  userId: string,
  syncState: string,
  googleCalendarCode: string,
  events: any[]
}

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  private url = this.config.getURL();
  private state: State

  constructor(
    private http: HttpClient,
    private config: ConfigService,
  ) { }

  getState(): any {
    return this.state;
  }

  initState(userId: string) {
    this.state = {
      userId: userId,
      syncState: null,
      googleCalendarCode: null,
      events: []
    };
  }

  // autoCalendarLogin() {
  //   if (localStorage.getItem('googleCalendarCode')) {
  //     this.state.googleCalendarCode = localStorage.getItem('googleCalendarCode');
  //     this.state.syncState = 'google'
  //     this.getGoogleEventsAndSave(this.state.googleCalendarCode);
  //   }
  // }

  clearCalendarInfo() {
    switch (this.state.syncState) {
      case 'google':
        localStorage.removeItem('googleCalendarCode');
      case 'apple':
      // localStorage.removeItem('appleCalendarCode');
      case 'microsoft':
      // localStorage.removeItem('microsoftCalendarCode');
    }

    this.state = {
      userId: null,
      syncState: null,
      googleCalendarCode: null,
      events: null
    }

  }

  saveEventsToDatabase(events: any): Promise<any> {

    return new Promise((res, rej) => {

      const data = {
        userId: this.state.userId,
        source: this.state.syncState,
        events: events
      }
      this.http.post<{ message: string; newEvents: any }>(
        this.url + 'calendar/saveEvents', data
      ).toPromise().then(
        data => {
          res(data);
        },
        error => {
          res(error);
        }
      )
    })
  }

  getEventsFromDatabase(): Promise<any[]> {
    return new Promise(async (res, rej) => {
      this.http.get<{ message: string; events: any }>(
        this.url + 'calendar/getDatabaseEvents/' + this.state.userId
      ).toPromise().then(
        data => {
          this.state.events = data.events;
          res(data.events)
        }
      ), error => {
        console.log(error)
        rej([])
      }
    })
  }

  // setType(type: string) {
  //   this.type = type;
  //   localStorage.setItem('calendarType', type);
  // }

  // getType() {
  //   return localStorage.getItem('calendarType');
  //   // return this.type;
  // }

  // setCalendarid(calendarid) {
  //   localStorage.setItem('calendarid', calendarid);
  // }

  // getCalendarid() {
  //   return localStorage.getItem('calendarid');
  // }

  googleOath(): Promise<string> {
    return new Promise(async (res, rej) => {
      this.http.get<{ message: string, url: string }>(
        this.url + 'calendar/googleOath/'
      ).toPromise().then(
        data => {
          this.state.syncState = 'google';
          console.log(this.state);
          res(data.url);
        },
        error => {
          console.log(error);
          rej('')
        }
      )
    })
  }


  getGoogleEventsAndSave(googleCode: string): Promise<string> {
    return new Promise((res, rej) => {
      this.http.post<{ message: string; userData: any }>(
        this.url + 'calendar/getGoogleEvents', { code: googleCode }
      ).toPromise().then(
        data => {
          this.state.syncState = 'google';
          this.state.googleCalendarCode = googleCode;
          console.log(this.state);
          this.saveEventsToDatabase(data.userData.events)
            .then(
              result => {
                res(this.state.syncState);
              }
            ).catch(
              err => {
                rej('')
              }
            )

        },
        error => {
          this.state.syncState = null;
          rej(null);
        }
      )
    })
  }



  //iCloud sync
  getICloudEvents() {

    let start = '2020-05-01';
    let end = '2020-05-30';

    this.http.get<{ message: string, events: string }>(
      this.url + 'calendar/getICloudEvents?start=' + start + '&end=' + end
    ).toPromise().then(
      data => {
        console.log(data.events);
      },
      error => {
        console.log(error);
      }
    )
  }

  // getGoogleEvents(): Promise<any> {
  //   if (this.userData) {
  //     return new Promise((res, rej) => {
  //       res(this.userData);
  //     })
  //   } else {
  //     localStorage.removeItem('code');
  //     if (!this.code) {
  //       // this.code = localStorage.getItem('code');
  //     }
  //     let data = { code: this.code }
  //     console.log(data);
  //     // localStorage.setItem('code', data.code);

  //     return new Promise((res, rej) => {
  //       this.http.post<{ message: string; userData: any }>(
  //         this.url + 'calendar/getGoogleEvents', data
  //       ).toPromise().then(
  //         data => {
  //           console.log(data);
  //           this.userData = data.userData;
  //           let calendarid = new Date().getTime();
  //           this.setCalendarid(calendarid);
  //           let googledata = {
  //             calendarid: calendarid,
  //             events: this.userData
  //           }
  //           this.http.post(this.url + 'events/saveGoogleEvents', googledata)
  //             .subscribe(
  //               googledata => {
  //                 console.log(googledata);
  //               }
  //             )
  //           res(data.userData);
  //         },
  //         error => {
  //           console.log(error);
  //           rej({ error: 'Event create Error' });
  //         }
  //       )
  //     })
  //   }

  // }

  // getCurveEvents() {
  //   return new Promise((res, rej) => {
  //     let calendarid = localStorage.getItem('calendarid');
  //     this.http.get(this.url + 'events/' + calendarid).subscribe(
  //       data => {
  //         this.userData = data;
  //         res(data);
  //       },
  //       error => {
  //         console.log(error);
  //         rej(error);
  //       }
  //     )
  //   })
  // }

  microsoftSignIn() {
    return new Promise((res, rej) => {
      let headers = new HttpHeaders();
      headers = headers.set('Access-Control-Allow-Origin', '*');
      this.http.get(this.url + 'microsoft/signin', { headers: headers }).subscribe(
        data => {
          this.state.syncState = 'microsoft';

          console.log('DATA ', data);
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