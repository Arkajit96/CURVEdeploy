import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import {FlashMessagesService} from 'angular2-flash-messages';

//Models
import{ Opportunity } from '../shared/opportunity';
import { Application } from '../shared/application';

@Injectable({ providedIn: 'root' })
export class ResearchService {

  //Fields for opportunities
  private opportunities: Opportunity[] = [];
  private opportunitiesUpdated = new Subject<{ opportunities:Opportunity[]; count: number }>();

  constructor(private http: HttpClient, private flashMessage: FlashMessagesService) { }

// functions for fetching the opportunities
    getOppurtunities(numPerPage: number, currentPage: number){
        const queryParams = `?pagesize=${numPerPage}&page=${currentPage}`;
        this.http.get<{ message: string; opportunities: any; maxOpp: number }>(
          '/api/research/getOpportunities/' + queryParams
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


//upload files to application
uploadFile(id: any, type:string, fileData: any): Promise<any> {
    return new Promise((res, rej) => {
      const formData = new FormData();
      formData.append('file', fileData);
      formData.append('id', id);
      this.http.post('/api/research/upload' + type, formData).subscribe(
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

// submit the application
createApplication(application:Application): Promise<any> {
    return new Promise((res, rej) => {
        this.http.post('/api/research/createApplication', application).subscribe(
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

// Shopping cart related
  addToShoppingCart(application:Application){
    console.log(application);
  }
}