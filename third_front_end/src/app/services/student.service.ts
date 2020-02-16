import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private http: HttpClient) { }

  getStudent(id: string): Promise<any> {
    return new Promise((res, rej) => {
      this.http.get('/api/student/' + id).subscribe(
        data => {
          res(data);
        },
        error => {
          rej(error);
        }
      )
    })
  }

  search(query: String): Promise<any> {
    return new Promise((res, rej) => {
      this.http.get('/api/student/search/' + query).subscribe(
        data => {
          res(data);
        },
        error => {
          rej('Error searching');
        }
      )
    })
  }

  editInterests(id: any, interests: any): Promise<any> {
    return new Promise((res, rej) => {
      let form = {
        id: `${id}`,
        interests: interests
      }
      this.http.put('/api/student/editInterest', form).subscribe(
        data => {
          res(data);
        },
        error => {
          rej("Error updating interests")
        }
      )
    })
  }

  updateSummary(id: any, summary: String): Promise<any> {
    return new Promise((res, rej) => {
      let form = {
        user_id: id,
        summary: summary
      }
      this.http.post('/api/student/update/summary', form).subscribe(
        data => {
          res(data);
        },
        error => {
          rej("Error updating summary")
        }
      )
    })
  }

  updateStudent(id: string, form: any): Promise<any> {
    return new Promise((res, rej) => {
      let updates = {
        user_id: id,
        first_name: form.first_name.value,
        last_name: form.last_name.value,
        gender: form.gender.value,
        date_of_birth: form.dob.value,
        major: form.major.value,
        minor: form.minor.value,
        phone: form.phone.value,
        email: form.email.value
      }

      this.http.post('/api/student/update', updates).subscribe(
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

  uploadProfilePicture(id: any, imageData: any): Promise<any> {
    return new Promise((res, rej) => {
      const formData = new FormData();
      formData.append('image', imageData);
      formData.append('id', id);
      this.http.post('/api/student/upload/profilePic', formData).subscribe(
        data => {
          res(data);
        },
        error => {
          console.log(error);
          rej({error: 'Error uploading profile picture'});
        }
      )
    })
  }

  uploadResume(id: any, resumeData: any): Promise<any> {
    return new Promise((res, rej) => {
      const formData = new FormData();
      formData.append('file', resumeData);
      formData.append('id', id);
      this.http.post('/api/student/upload/resume', formData).subscribe(
        data => {
          res(data);
        },
        error => {
          console.log(error);
          rej({error: 'Error uploading resume'});
        }
      )
    })
  }

}
