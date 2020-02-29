import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FacultyService {

  // Singleton Faculty user
  private faculty : any;

  constructor(private http: HttpClient) { }

  getCurrentFacultyUser(){
    return this.faculty;
  }

  clearCurrentUser(){
    this.faculty = null;
  }


  LogInAsFaculty(userId:string): Promise<boolean> {
    return new Promise((res, rej) =>{
      if(this.faculty){ res(true) };
        this.http.get<{ message: string; faculty: any;}>(
          '/api/faculty/' + userId
          ).toPromise().then(
            data => {
              this.faculty = data.faculty;
              res(true);
            },
            error => {
              rej(false);
            }
          )
      });
    }

  loadFaculty(id: String): Promise<any> {
      return new Promise((res, rej) => {
          this.http.get("/api/faculty/" + id).subscribe(
              data => {
                res(data);
              },
              error => {
                  rej(error);
              }
          )
      })
  }

  search(searchQuery): Promise<any> {
      return new Promise((res, rej) => {
          this.http.get("/api/faculty/search/" + searchQuery).subscribe(
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