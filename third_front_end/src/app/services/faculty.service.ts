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

  editInterests(id: any, interests: any) {
    return new Promise((res, rej) => {
      let form = {
        id: `${id}`,
        interests: interests
      }
      this.http.put('/api/faculty/editInterest', form).subscribe(
        data => {
          res(data);
        },
        error => {
          rej("Error updating interests")
        }
      )
    })
  }

  updateSummary(id: any, researchSummary: any, currentProjects: any): Promise<any> {
    return new Promise((res, rej) => {
      let form = {
        id: id,
        researchSummary: researchSummary,
        currentProjects: currentProjects
      };
      this.http.post('/api/faculty/update/summary', form).subscribe(
        data => {
          res(data);
        },
        error => {
          rej(error);
        }
      )
    })
  }

  uploadProfilePicture(id: any, imageData: any): Promise<any> {
    return new Promise((res, rej) => {
      const formData = new FormData();
      formData.append('image', imageData);
      formData.append('id', id);
      this.http.post('/api/faculty/upload/profilePic', formData).subscribe(
        data => {
          // this.updateLocalStorage(data);
          res(data);
        },
        error => {
          console.log(error);
          rej({error: 'Error uploading profile picture'});
        }
      )
    })
  }

  updateFaculty(id: string, form: any): Promise<any> {
    return new Promise((res, rej) => {
      let updates = {
        user_id: id,
        first_name: form.first_name.value,
        last_name: form.last_name.value,
        gender: form.gender.value,
        phone: form.phone.value,
        email: form.email.value,
        education: form.education.value,
        experience: form.experience.value,
        department: form.department.value,
        address: form.office.value
      }

      this.http.post('/api/faculty/update', updates).subscribe(
        data => {
          res(data);
        },
        error => {
          console.log(error);
          res({error: 'Error saving changes'});
        }
      )
    })
  }

}