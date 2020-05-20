import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


// Service
import { ConfigService } from './config.service';

export interface State {
  userId: string,
  syncState: string,
  calendarCode: string,
  events: any[]
}

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  private url = this.config.getURL();
  // private syncState: string = null;
  // private calendarCode: string;


  private state: State

  // private code: string;
  // private type: string;
  private userData: any;


  constructor(
    private http: HttpClient,
    private config: ConfigService,
  ) { }

  getCalendarCode() {
    if (!this.state.calendarCode) {
      this.state.calendarCode = localStorage.getItem('googleCalendarCode')
        || localStorage.getItem('appleCalendarCode') || localStorage.getItem('windowsCalendarCode');
    }
    return this.state.calendarCode;
  }

  getState(): any {
    return this.state;
  }

  initState(userId: string){
    this.state = {
      userId: userId,
      syncState: null,
      calendarCode: null,
      events: []
    };
  }

  autoCalendarLogin() {
    const googleCalendarCode = localStorage.getItem('googleCalendarCode');
    const appleCalendarCode = localStorage.getItem('appleCalendarCode');
    const windowsCalendarCode = localStorage.getItem('windowsCalendarCode');

    if (googleCalendarCode) {
      this.state.calendarCode = googleCalendarCode;
      this.state.syncState = 'google'
      this.getGoogleEventsAndSave(googleCalendarCode);
    } else if (appleCalendarCode) {
      this.state.calendarCode = appleCalendarCode;
      this.state.syncState = 'apple';
    } else if (windowsCalendarCode) {
      this.state.calendarCode = windowsCalendarCode;
      this.state.syncState = 'windows';
    }
  }

  clearCalendarInfo() {
    switch (this.state.syncState) {
      case 'google':
        localStorage.removeItem('googleCalendarCode');
      case 'apple':
        localStorage.removeItem('appleCalendarCode');
      case 'windows':
        localStorage.removeItem('windowsCalendarCode');
    }

    this.state = {
      userId: null,
      syncState: null,
      calendarCode: null,
      events: null
    }

  }

  saveEventsToDatabase(events: any): Promise<any> {

    return new Promise((res, rej) => {

      const data = {
        userId: this.state.userId,
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
          console.log(data.events);
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

  googleOath() {
    this.http.get<{ message: string, url: string }>(
      this.url + 'calendar/googleOath/'
    ).toPromise().then(
      data => {
        this.state.syncState = 'google';

        window.location.href = data.url;
      },
      error => {
        console.log(error);
      }
    )
  }


  getGoogleEventsAndSave(googleCode: string): Promise<string> {
    return new Promise((res, rej) => {
      this.http.post<{ message: string; userData: any }>(
        this.url + 'calendar/getGoogleEvents', { code: googleCode }
      ).toPromise().then(
        data => {
          this.saveEventsToDatabase(data.userData.events)
            .then(
              result => {
                res(this.state.syncState);
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

    let start  = '2020-05-01';
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

}