import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.scss']
})
export class StudentProfileComponent implements OnInit {
  student_id:any
  constructor(public route:ActivatedRoute, public http: HttpClient, ) { }
  
  ngOnInit() {
    //let hrefUrl:any = location.href;
    //this.student_id = hrefUrl.substring(36);
    this.route.params.subscribe((data) => {
      this.student_id = data.id;
      console.log(this.student_id);
      console.log("route successfully" + JSON.stringify(this.student_id));
      // const params = new HttpParams({fromObject: {id: this.student_id}});
      // const reqHeader = new HttpHeaders({"content-type": "application/x-www-form-urlencoded"});
      this.http.get("/api/student/" + this.student_id).subscribe((res:any) => {
        console.log(res)
      
    })
  }
    )
}}
