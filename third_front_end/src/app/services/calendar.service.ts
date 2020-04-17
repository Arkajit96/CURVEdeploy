import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


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

  getGoogleEvents(): Promise<any> {
    console.log(this.userData);
    if (this.userData) {
      return new Promise((res, rej) => {
        res(this.userData);
      })
    } else {
      let data = {code: this.code}

      return new Promise((res, rej) => {
        this.http.post<{ message: string; userData: any }>(
          this.url + 'calendar/getGoogleEvents', data
        ).toPromise().then(
          data => {
            this.userData = data.userData;
            res(data.userData);
          },
          error => {
            res(error);
          }
        )
      })

    }

  }
}