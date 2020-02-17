import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import {FlashMessagesService} from 'angular2-flash-messages';

//Models
import{ Opportunity } from '../shared/opportunity';
import { Application } from '../shared/application';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  //Fields for opportunities
  private opportunities: Opportunity[] = [];
  private opportunitiesUpdated = new Subject<{ opportunities:Opportunity[]; count: number }>();

  constructor(private http: HttpClient, private flashMessage: FlashMessagesService) { }

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

  uploadFile(id: any, fileData: any, fileType): Promise<any> {
    return new Promise((res, rej) => {
      const formData = new FormData();
      formData.append('file', fileData);
      formData.append('id', id);
      formData.append('fileType', fileType);
      this.http.post('/api/student/upload/file', formData).subscribe(
        data => {
          res(data);
        },
        error => {
          console.log(error);
          rej({error: 'Error uploading file'});
        }
      )
    })

}

  // functions for fetching the opportunities
  getOppurtunities(numPerPage: number, currentPage: number){
    // this.opportunities= [
    //   {name:'lab 1',school:'pitt',summary:'test summary',expireTime:'2/5/2020',icon:'https://material.angular.io/assets/img/examples/shiba2.jpg'},
    //   {name:'lab 2',school:'pitt',summary:'test summary 2',expireTime:'2/10/2020',icon:'https://material.angular.io/assets/img/examples/shiba2.jpg'}
    // ];

    const queryParams = `?pagesize=${numPerPage}&page=${currentPage}`;
    this.http.get<{ message: string; opportunities: any; maxOpp: number }>(
      '/api/student/getOpportunities/' + queryParams
      ).pipe(
        map(optData =>{
        return {
          opportunities : optData.opportunities.map(opt => {
              return {
                id: opt._id,
                name:  opt.name,
                school:opt.school,
                summary:opt.summary,
                expireTime:opt.expireTime,
                icon:opt.icon
                };
            }),
            count: optData.maxOpp
        };
      })
    )
    .subscribe(newOppData => {
      this.opportunities = newOppData.opportunities;
      this.opportunitiesUpdated.next({
        opportunities: [...this.opportunities],
        count: newOppData.count
      });
    });
}

  getopportunitiesUpdatedListener() {
    return this.opportunitiesUpdated.asObservable();
  }

  getStudentByUserId(userId:string){
  return new Promise((res, rej) =>{
      this.http.get<{ message: string; student: any;}>(
        '/api/student/' + userId
        ).toPromise().then(
          data => {
            res(data.student);
          },
          error => {
            this.flashMessage.show(error.error.message, {
              cssClass: 'alert-danger',
              timeout: 5000
            });
            rej(error);
          }
        )
    });
  }


  // Shopping cart related
  addToShoppingCart(application:Application){
    console.log(application);
  }
}