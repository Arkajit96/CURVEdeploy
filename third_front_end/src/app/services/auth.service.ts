import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { FlashMessagesService } from 'angular2-flash-messages';

// Service
import { StudentService } from './student.service';
import { FacultyService } from './faculty.service';
import { CalendarService } from './calendar.service'

// user model for auth
import { User } from '../shared/User';
import { ChatService } from './chat.service';
import { ConfigService } from './config.service';

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
    private flashMessage: FlashMessagesService,
    private studentService: StudentService,
    private facultyService: FacultyService,
    private calendarService: CalendarService,
    private chatService: ChatService,
    private config: ConfigService
  ) { }

  private url = this.config.getURL();

  getToken() {
    return this.token;
  }

  getIsAuth(): Promise<boolean> {
    return new Promise((res, rej) => {
      if (this.entity === 'student') {
        this.studentService.LogInAsStudent(this.userId)
          .then(isAuth => {
            res(this.isAuthenticated && isAuth)
          })
          .catch(err =>{
            rej(false);
          })
      } else if (this.entity === 'faculty') {
        this.facultyService.LogInAsFaculty(this.userId)
        .then(isAuth => {
          res(this.isAuthenticated && isAuth)
        })
        .catch(err =>{
          rej(false);
        })
      }else{
        res(this.isAuthenticated);
      }
    })
  }

  getUserId() {
    return this.userId;
  }

  getEntity() {
    return this.entity;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string, entity: string) {
    const user: User = { email, password, entity };
    this.http.post<{ message: string }>
      (this.url + 'register', user).subscribe(
        res => {
          this.flashMessage.show(res.message, {
            cssClass: 'alert-success',
            timeout: 5000
          });
          this.router.navigate(['/']);
        },
        error => {
          this.flashMessage.show(error.error.message, {
            cssClass: 'alert-danger',
            timeout: 5000
          });
          this.authStatusListener.next(false);
        }
      );
  }

  login(email: string, password: string, entity: string) {
    const user: User = { email, password, entity };
    this.http
      .post<{ token: string; expiresIn: number; userId: string; entity: string }>(
        this.url + 'login',
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
            this.chatService.connectToSocket(this.userId);
            if (this.entity === 'student') {
              this.studentService.LogInAsStudent(this.userId)
                .then(res => {
                  if (res) { this.router.navigate(['/studentProfile']); }
                })
            } else if (this.entity === 'faculty') {
              this.facultyService.LogInAsFaculty(this.userId)
              .then(res => {
                if (res) { this.router.navigate(['/facultyProfile']); }
              })
            }
          }
        },
        reserror => {
          this.flashMessage.show('Authentication failed', {
            cssClass: 'alert-danger',
            timeout: 5000
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

    // clear user profile
    if (this.entity === 'student') {
      this.studentService.clearCurrentUser();
    } else if (this.entity === 'faculty') {
      this.facultyService.clearCurrentUser();
    }

    this.entity = null;
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
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
    localStorage.removeItem('entity');
    localStorage.clear();

    // clearsingleton
    this.studentService.clearCurrentUser();
    this.facultyService.clearCurrentUser();
    this.calendarService.clearCurrentUserCode();
    
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
