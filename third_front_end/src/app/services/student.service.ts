import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from "rxjs";
import { map } from "rxjs/operators";

//Models
import{ Student } from '../shared/student';


@Injectable({
  providedIn: 'root'
})
export class StudentService {

  //Fields for opportunities
  // private opportunities: Opportunity[] = [];
  // private opportunitiesUpdated = new Subject<{ opportunities:Opportunity[]; count: number }>();

  // singleton Student User
  private student: any;

  constructor(private http: HttpClient) { }

  getCurrentStudentUser() {
    return this.student;
  }

  clearCurrentUser() {
    this.student = null;
  }


  LogInAsStudent(userId: string): Promise<boolean> {
    return new Promise((res, rej) => {
      if (this.student) { res(true) };
      this.http.get<{ message: string; student: any; }>(
        '/api/student/' + userId
      ).toPromise().then(
        data => {
          this.student = data.student;
          res(true);
        },
        error => {
          rej(false);
        }
      )
    });
  }

  getStudentByUserId(userId: string): Promise<any> {
    return new Promise((res, rej) => {
      this.http.get<{ message: string; student: any; }>(
        '/api/student/' + userId
      ).toPromise().then(
        data => {
          res(data.student);
        },
        error => {
          rej(error);
        }
      )
    });
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
          this.student = data;
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
          this.student = data;
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
          this.student = data;
          res(data);
        },
        error => {
          console.log(error);
          res({ error: 'Error saving changes' });
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
          this.student = data;
          res(data);
        },
        error => {
          console.log(error);
          rej({ error: 'Error uploading profile picture' });
        }
      )
    })
  }

  uploadFile(id: any, fileData: any, fileType): Promise<any> {
    return new Promise((res, rej) => {
      const formData = new FormData();
      formData.append('file', fileData);
      formData.append('id', id);
      formData.append('fileType', fileType);
      this.http.post('/api/student/upload/file', formData).subscribe(
        data => {
          this.student = data;
          res(data);
        },
        error => {
          console.log(error);
          rej({ error: 'Error uploading file' });
        }
      )
    })

  }

  // Shopping cart related
  addToShoppingCart(id: string, newItem: any): Promise<any> {
    return new Promise((res, rej) => {
      let form = {
        id: `${id}`,
        newItem: newItem
      }
      this.http.post<{ message: string; student: any; }>(
        '/api/student/addToShoppingCart', form)
        .subscribe(
          data => {
            this.student = data.student;
            res(data);
          },
          error => {
            console.log(error);
            rej({ error: 'Add to shopping cart error' });
          }
        )
    })
  }

  // Shopping cart related
  deleteItem(id: string, Itemid: string): Promise<any> {
    return new Promise((res, rej) => {
      let form = {
        id: `${id}`,
        Itemid: Itemid
      }
      this.http.post<{ message: string; student: any; }>(
        '/api/student/deleteItem', form)
        .subscribe(
          data => {
            this.student = data.student;
            res(data);
          },
          error => {
            console.log(error);
            rej({ error: 'Delete from shopping cart error' });
          }
        )
    })
  }

  getShoppingCartItemsByIds(ids: any): Promise<any> {
    return new Promise((res, rej) => {
      let form = { ids: ids }
      this.http.post<{ message: string; items: any; }>(
        '/api/student/getShoppingCartItemsByIds', form)
        .subscribe(
          data => {
            res(data);
          },
          error => {
            console.log(error);
            rej({ error: 'get shopping cart items error' });
          }
        )
    })
  }
}