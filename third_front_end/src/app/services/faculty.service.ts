import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FacultyService {

  constructor(private http: HttpClient) { }

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