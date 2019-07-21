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
  student_id:any;
  student:any;
  id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  major: string;
  minor: string;
  email: any;
  phone: string;
  address: string;
  graduation_class: number;
  gender: string;
  date_of_birth: string;
  date_of_joining: string;
  summary: string;
  image: string;
  constructor(public route:ActivatedRoute, public http: HttpClient, public router: Router) { }

  ngOnInit() {
    this.student_id = this.route.snapshot.queryParamMap.get('student_id');
    this.http.get("/api/student/" + this.student_id).subscribe((res:any) => {
      console.log(res);
      this.student = res;
      this.id = this.student['_id'];
      this.first_name = this.student['first_name'];
      this.middle_name = this.student['middle_name'];
      this.last_name = this.student['last_name'];
      this.email = this.student['email'];
      this.gender = this.student['gender'];
      this.date_of_birth = this.student['date_of_birth'];
      this.date_of_joining = this.student['date_of_joining'];
      this.address = this.student['address'];
      this.phone = this.student['phone'];
      this.summary = this.student['summary'];
      this.image = this.student['image'];
    })
    
  }
  editStudent(student: any) {
    console.log(student)
    const params = new HttpParams({fromObject: student});
    
    const reqHeader = new HttpHeaders({"content-type": "application/x-www-form-urlencoded"});
    this.http.put("/api/student/edit/" + this.student_id, params, {headers:reqHeader, observe: "response"}).subscribe((res:any) => {
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
