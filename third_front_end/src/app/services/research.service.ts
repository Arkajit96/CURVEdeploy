import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { FlashMessagesService } from 'angular2-flash-messages';

//Models
import { Student } from '../shared/student';
import { Opportunity } from '../shared/opportunity';
import { Application } from '../shared/application';

@Injectable({ providedIn: 'root' })
export class ResearchService {

  //Fields for opportunities
  private opportunities: Opportunity[] = [];
  private opportunitiesUpdated = new Subject<{ opportunities: Opportunity[]; count: number }>();

  constructor(private http: HttpClient, private flashMessage: FlashMessagesService) { }

  // functions for fetching the opportunities
  getOppurtunities(numPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${numPerPage}&page=${currentPage}`;
    this.http.get<{ message: string; opportunities: any; maxOpp: number }>(
      '/api/research/getOpportunities/' + queryParams
    ).pipe(
      map(optData => {
        return {
          opportunities: optData.opportunities.map(opt => {
            return {
              id: opt._id,
              name: opt.name,
              school: opt.school,
              summary: opt.summary,
              expireTime: opt.expireTime,
              icon: opt.icon
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

  getCandidates(optId: string): Promise<any> {
    return new Promise((res, rej) => {
      this.http.get<{ message: string; tableRow:any }>(
        '/api/research/getCandidates/' + optId
      ).toPromise().then(
        data => {
          res(data.tableRow);
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

  getOptByIds(studentId:string, optId: string): Promise<any> {
    const queryParams = `?studentId=${studentId}&optId=${optId}`; 
    return new Promise((res, rej) => {
      this.http.get<{ message: string; opt: Opportunity; application: Application }>(
        '/api/research/getOptByIds/' + queryParams
      ).toPromise().then(
        data => {
          res({
            currentOpt: data.opt,
            application: data.application
          });
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


  //upload files to application
  uploadFile(studentID: string, opportunityID: string, fileType: string, fileData: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', fileData);
    formData.append('studentID', studentID);
    formData.append('opportunityID', opportunityID);
    formData.append('fileType', fileType);
    return new Promise((res, rej) => {
      this.http.post<{ message: String; location: String }>(
        '/api/research/uploadFile', formData)
        .toPromise().then(
          data => {
            res(data);
          },
          error => {
            console.log(error);
            rej({ error: 'Error uploading file' });
          }
        )
    })
  }

  uploadFileMultiApp(studentID: string, opportunityIDs: any, fileType: string, fileData: File): Promise<any> {
    const formData = new FormData();
    formData.append('studentID', studentID);
    formData.append('file', fileData);
    formData.append('fileType', fileType);
    if (Array.isArray(opportunityIDs)) {
      opportunityIDs.forEach(optId => {
        formData.append('opportunityIDs[]', optId);
      })
    }
    return new Promise((res, rej) => {
      this.http.post<{ message: String; location: String }>(
        '/api/research/uploadFileMultiApp', formData)
        .toPromise().then(
          data => {
            res(data);
          },
          error => {
            console.log(error);
            rej({ error: 'Error uploading file' });
          }
        )
    })
  }

  // submit the application
  createApplication(application: Application): Promise<any> {
    return new Promise((res, rej) => {
      this.http.post<{ message: String; applicationID: String }>(
        '/api/research/createApplication', application)
        .toPromise().then(
          data => {
            res(data);
          },
          error => {
            console.log(error);
            rej({ error: 'Application create Error' });
          }
        )
    })
  }

  // submit the application
  createMultiApplications(studentID: string, opportunityIDs: any, resume: string, coverLetter: string): Promise<any> {
    // Very weird why formData doesn't work??

    // const formData = new FormData();
    // formData.append('studentID', studentID);
    // formData.append('resume', resume);
    // formData.append('coverLetter', coverLetter);
    // if (Array.isArray(opportunityIDs)) {
    //   opportunityIDs.forEach(optId => {
    //     formData.append('opportunityIDs[]', optId);
    //   })
    // }

    let optIdList = [];
    if (Array.isArray(opportunityIDs)) {
      opportunityIDs.forEach(optId => {
        optIdList.push(optId);
      })
    }

    const formData = {
      resume: resume,
      coverLetter: coverLetter,
      studentID: studentID,
      opportunityIDs: optIdList
    }

    return new Promise((res, rej) => {
      this.http.post<{ message: String }>(
        '/api/research/createMultiApplications', formData)
        .toPromise().then(
          data => {
            res(data);
          },
          error => {
            console.log(error);
            rej({ error: 'Error uploading file' });
          }
        )
    })
  }

}