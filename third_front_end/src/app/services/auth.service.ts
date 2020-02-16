import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import {FlashMessagesService} from 'angular2-flash-messages';

// user model for auth
import { User } from '../shared/User';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private userId: string;
  private entity: string;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient,
              private router: Router,
              private flashMessage: FlashMessagesService) {}

  getToken() {
    return localStorage.getItem("token");
    return this.token;
  }

  getIsAuth() {
    let expirationTime = new Date(localStorage.getItem("expiration"));
    if(expirationTime < new Date()){
      return false;
    } else {
      return true;
    }
  }

  getUserId() {
    return localStorage.getItem("userId")
    return this.userId;
  }

  getEntity() {
    return localStorage.getItem("entity");
    return this.entity;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string, entity: string ) {
    const user: User = { email, password, entity};
    this.http.post<{ message: string}>
    ('/api/register', user).subscribe(
       res => {
        this.flashMessage.show(res.message, {
          cssClass: 'alert-success',
          timeout: 2000
        });
        this.router.navigate(['/']);
      },
      error => {
        this.flashMessage.show(error, {
          cssClass: 'alert-danger',
          timeout: 2000
        });
        this.authStatusListener.next(false);
      }
    );
  }

  login(email: string, password: string, entity: string) {
    const user: User = { email, password, entity };
    this.http
      .post<{ token: string; expiresIn: number; userId: string; entity: string }>(
        '/api/login',
        user
      )
      .subscribe(
        response => {
          const token = response.token;
          this.token = token;
          if (token) {
            const expiresInDuration = response.expiresIn;
            this.setAuthTimer(expiresInDuration);
            this.isAuthenticated = true;
            this.userId = response.userId;
            this.entity = response.entity;
            this.authStatusListener.next(true);
            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + expiresInDuration * 1000
            );
            this.saveAuthData(token, expirationDate, this.userId, this.entity);


            if (this.entity === 'student') {
              this.router.navigate(['/studentProfile/', this.userId]);
            } else if (this.entity === 'faculty') {
              this.router.navigate(['/facultyProfile/', this.userId]);
            }
          }
        },
        error => {
          this.flashMessage.show('Authentication failed', {
            cssClass: 'alert-danger',
            timeout: 2000
          });
          this.authStatusListener.next(false);
        }
      );
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.entity = authInformation.entity;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string, entity: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
    localStorage.setItem('entity', entity);
    localStorage.setItem('isAuth', "1");
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
    localStorage.removeItem('entity');
    localStorage.clear();
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    const entity = localStorage.getItem('entity');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token,
      expirationDate: new Date(expirationDate),
      userId,
      entity
    };
  }
}
