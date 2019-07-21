import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
@Component({
  selector: 'app-edit-faculty',
  templateUrl: './edit-faculty.component.html',
  styleUrls: ['./edit-faculty.component.scss']
})
export class EditFacultyComponent implements OnInit {
  id:any;
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
  gender: string;
  date_of_birth: string;
  date_of_joning: string;
  address: string;
  phone: string;
  research_summary: string;
  current_projects: string;
  department: string;
  education: string;
  experience: string;
  image: string;
  
  faculty_id: string;
  faculty: any;

  constructor(public route:ActivatedRoute, public http: HttpClient, public router: Router) { }

  ngOnInit() {
    this.faculty_id = this.route.snapshot.queryParamMap.get('faculty_id');
    this.http.get("/api/faculty/" + this.faculty_id).subscribe((res:any) => {
      console.log(res);
      this.faculty = res;
      this.id = this.faculty['_id'];
      this.first_name = this.faculty['first_name'];
      this.middle_name = this.faculty['middle_name'];
      this.last_name = this.faculty['last_name'];
      this.email = this.faculty['email'];
      this.gender = this.faculty['gender'];
      this.date_of_birth = this.faculty['date_of_birth'];
      this.date_of_joning = this.faculty['date_of_joining'];
      this.address = this.faculty['address'];
      this.phone = this.faculty['phone'];
      this.research_summary = this.faculty['research_summary'];
      this.current_projects = this.faculty['current_projects'];
      this.department = this.faculty['department'];
      this.education = this.faculty['education'];
      this.experience = this.faculty['experience'];
      this.image = this.faculty['image'];  
    })
    
    
  }
  editFaculty(faculty: any) {
    console.log(faculty)
    const params = new HttpParams({fromObject: faculty});
    const reqHeader = new HttpHeaders({"content-type": "application/x-www-form-urlencoded"});
    console.log(this.id);
    console.log(params);
    this.http.put("/api/faculty/edit/" + this.id, params, {headers:reqHeader, observe: "response"}).subscribe((res:any) => {
      //console.log(res)
      if (res.body.message == 'successful') {
        this.router.navigate(['/facultyProfile/', res.body.id]);
        //console.log(res.body);
        // this.person = res.body;
        // if (this.person.message) {
        //   alert(this.person.message);
          //this.router.navigate()

        } 
      console.log(res);
  });
}

}
