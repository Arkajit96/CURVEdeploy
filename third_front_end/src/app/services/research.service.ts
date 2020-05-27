import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { FlashMessagesService } from 'angular2-flash-messages';

//Models
import { Student } from '../shared/student';
import { Opportunity } from '../shared/opportunity';
import { Application } from '../shared/application';
import { ConfigService } from './config.service';
import { Faculty } from '../shared/faculty';

@Injectable({ providedIn: 'root' })
export class ResearchService {

  //Fields for opportunities
  private opportunities: Opportunity[] = [];
  private opportunitiesUpdated = new Subject<{ opportunities: Opportunity[]; count: number }>();
  private url = this.config.getURL();

  constructor(
    private http: HttpClient, 
    private config: ConfigService
  ) { }

  // functions for fetching the opportunities
  getOppurtunities(numPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${numPerPage}&page=${currentPage}`;
    this.http.get<{ message: string; opportunities: any; maxOpp: number }>(
      this.url + 'research/getOpportunities/' + queryParams
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


  createOrUpdateOpportunity(id: string, form: any, faculty:any): Promise<any> {
    return new Promise((res, rej) => {
      let data = {
        name: form.name.value,
        expireTime: form.expireTime.value,
        summary: form.summary.value,
        faculty: faculty
      }

      this.http.post<{ message: string; opportunity: any; faculty: any }>(
        this.url + 'research/createOrUpdateOpportunity', data
        ).toPromise().then(
        data => {
          res(data);
        },
        error => {
          res(error);
        }
      )
    })
  }

  uploadOpportunityIcon(facultyId: any, imageData: any): Promise<any> {
    return new Promise((res, rej) => {
      const formData = new FormData();
      formData.append('image', imageData);
      formData.append('facultyId', facultyId);
      this.http.post(this.url + 'research/uploadIcon', formData).subscribe(
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

  getCandidates(optId: string): Promise<any> {
    return new Promise((res, rej) => {
      this.http.get<{ message: string; tableRow:any }>(
        this.url + 'research/getCandidates/' + optId
      ).toPromise().then(
        data => {
          res(data.tableRow);
        },
        error => {
          rej(error);
        }
      )
    });
  }

  getOptByIds(optId: string): Promise<any> {
    return new Promise((res, rej) => {
      this.http.get<{ message: string; opt: Opportunity}>(
        '/api/research/getOptByIds/' + optId
      ).toPromise().then(
        data => {
          res(data.opt);
        },
        error => {
          rej(error);
        }
      )
    });
  }

  getApplicationInfo(studentId:string, optId: string): Promise<any> {
    const queryParams = `?studentId=${studentId}&optId=${optId}`; 
    return new Promise((res, rej) => {
      this.http.get<{ message: string; opt: Opportunity; application: Application; faculty: Faculty}>(
        '/api/research/getApplicationInfo/' + queryParams
      ).toPromise().then(
        data => {
          res({
            currentOpt: data.opt,
            application: data.application,
            faculty: data.faculty
          });
        },
        error => {
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
        this.url + 'research/uploadFile', formData)
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
        this.url + 'research/uploadFileMultiApp', formData)
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
        this.url + 'research/createApplication', application)
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
        this.url + 'research/createMultiApplications', formData)
        .toPromise().then(
          data => {
            res(data);
          },
          error => {
            console.log(error);
            rej({ error: 'Creating applications error' });
          }
        )
    })
  }

  updateApplicationStatus( applicationID: string, status : string): Promise<any> {
    const formData = {
      applicationID: applicationID,
      status: status
    }

    return new Promise((res, rej) => {
      this.http.post<{ message: String; application: String }>(
        '/api/research/updateApplicationStatus', formData)
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