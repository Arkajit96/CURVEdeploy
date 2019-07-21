import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-edit-student',
  templateUrl: './edit-student.component.html',
  styleUrls: ['./edit-student.component.scss']
})
export class EditStudentComponent implements OnInit {
  student:any;
  id: string;
  major: string;
  minor: string;
  email: any;
  phone: string;
  research_summary: string;
  constructor(public route:ActivatedRoute, public http: HttpClient, public router: Router) { }

  ngOnInit() {
    this.id = this.route.snapshot.queryParamMap.get('student_id');
    this.major = this.route.snapshot.queryParamMap.get('major');
    this.minor = this.route.snapshot.queryParamMap.get('minor');
    this.email = this.route.snapshot.queryParamMap.get('email');
    this.phone = this.route.snapshot.queryParamMap.get('phone');
    this.research_summary = this.route.snapshot.queryParamMap.get('summary');
    // this.route.params.subscribe((data) => {
    //   console.log(data);a
      // this.student = data.id;
      // console.log(this.faculty_id);
      // console.log("route successfully" + JSON.stringify(this.faculty_id));
      // // const params = new HttpParams({fromObject: {id: this.student_id}});
      // // const reqHeader = new HttpHeaders({"content-type": "application/x-www-form-urlencoded"});
      // this.http.get("/api/faculty/" + this.faculty_id).subscribe((res:any) => {
      //   console.log(res)
      //   this.faculty = res;
      
    // })
  // });
  }
  editStudent(student: any) {
    console.log(student)
    const params = new HttpParams({fromObject: student});
    
    const reqHeader = new HttpHeaders({"content-type": "application/x-www-form-urlencoded"});
    this.http.put("/api/student/edit/" + this.id, params, {headers:reqHeader, observe: "response"}).subscribe((res:any) => {
      console.log(res)
      if (res.body.message == 'successful') {
        this.router.navigate(['/studentProfile/', res.body.id]);
        //console.log(res.body);
        // this.person = res.body;
        // if (this.person.message) {
        //   alert(this.person.message);
          //this.router.navigate()

        }   
  });
}
}
