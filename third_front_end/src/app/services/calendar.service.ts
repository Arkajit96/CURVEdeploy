import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


// Service
import { ConfigService } from './config.service';

@Injectable({ 
  providedIn: 'root'
 })
export class CalendarService {

  private url = this.config.getURL();
  private syncState: string = null;
  private calendarCode: string;


  constructor(
    private http: HttpClient,
    private config: ConfigService,
  ) { }

  getCalendarCode() {
    if(! this.calendarCode){ 
      this.calendarCode = localStorage.getItem('googleCalendarCode') 
      || localStorage.getItem('appleCalendarCode') || localStorage.getItem('windowsCalendarCode');
    }
    return this.calendarCode;
  }

  getSyncState(): string{
    return this.syncState;
  }

  autoCalendarLogin(){
    const googleCalendarCode = localStorage.getItem('googleCalendarCode');
    const appleCalendarCode = localStorage.getItem('appleCalendarCode');
    const windowsCalendarCode = localStorage.getItem('windowsCalendarCode');

    if(googleCalendarCode){
      this.calendarCode = googleCalendarCode;
      this.getGoogleEvents(googleCalendarCode);
      this.syncState = 'google';
    }else if (appleCalendarCode){
      this.calendarCode = appleCalendarCode;
      this.syncState = 'apple';
    }else if (windowsCalendarCode){
      this.calendarCode = windowsCalendarCode;
      this.syncState = 'windows';
    }
  }

  clearCurrentUserCode() {
    this.calendarCode = null;
    switch (this.syncState) {
      case 'google':
        localStorage.removeItem('googleCalendarCode');
      case 'apple':
        localStorage.removeItem('appleCalendarCode');
      case 'windows':
        localStorage.removeItem('windowsCalendarCode');
    }
    this.syncState = null;
  }

  saveEventsToDatabase(events: any): Promise<any> {

    return new Promise((res, rej) => {

      const data = {
        userId: localStorage.getItem('userId'),
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

  getEvents(): Promise<boolean>{
    return new Promise(async (res, rej) => {
      this.http.get<{message: string; events: any}>(
        this.url + 'calendar/getDatabaseEvents'
      ).toPromise().then(
        data =>{
          console.log(data.events);
          res(data.events)
        }
      ),error => {
        console.log(error)
        rej([])
      }
    })
  }

  googleOath() {
    this.http.get<{ message: string, url: string }>(
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

  getGoogleEvents(googleCode: string): Promise<string> {
    return new Promise((res, rej) => {
      this.http.post<{ message: string; userData: any }>(
        this.url + 'calendar/getGoogleEvents', {code: googleCode}
      ).toPromise().then(
        data => {
          console.log(data.userData);
          this.saveEventsToDatabase(data.userData.events)
          .then(
            result => {
              this.syncState = 'google';
              res(this.syncState);
            }
          )
          
        },
        error => {
          this.syncState = null;
          rej(null);
        }
      )
    })
  }


  addEventsToDatabase(userId: string, eventData: any): Promise<any>{

    const data = {
      userId: userId,
      events: eventData
    }

    return new Promise((res, rej) => {
      this.http.post<{ message: String; event: String }>(
        this.url + 'calendar/addEventsToDatabase', data)
        .toPromise().then(
          data => {
            res(data.event);
          },
          error => {
            console.log(error);
            rej({ error: 'Event create Error' });
          }
        )
    })

  }
}