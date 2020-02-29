import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-faculty-profile',
  templateUrl: './faculty-profile.component.html',
  styleUrls: ['./faculty-profile.component.scss']
})
export class FacultyProfileComponent implements OnInit {
  faculty_id:any;
  faculty:any;
  constructor(public route:ActivatedRoute, public http: HttpClient, public router: Router) { }

  ngOnInit() {
    this.faculty = {
      image: ""
    };
    this.route.params.subscribe((data) => {
      this.faculty_id = data.id;
      //console.log(this.faculty_id);
      console.log("route successfully" + JSON.stringify(this.faculty_id));
      // const params = new HttpParams({fromObject: {id: this.student_id}});
      // const reqHeader = new HttpHeaders({"content-type": "application/x-www-form-urlencoded"});
      this.http.get("/api/faculty/" + this.faculty_id).subscribe((res:any) => {
        console.log(res)
        this.faculty = res;
        localStorage.setItem('faculty', JSON.stringify(this.faculty));
      })
    });
  }
  edit() {
    this.router.navigate(['/editFacultyProfile/'], 
    {queryParams : 
      {faculty_id: this.faculty_id}
      // {faculty_id: this.faculty._id, email: this.faculty.email,
      // gender: this.faculty.gender, address: this.faculty.address, phone: this.faculty.phone, summary: this.faculty.research_summary,
      // projects: this.faculty.current_projects,
      // department: this.faculty.department, education: this.faculty.education, experience: this.faculty.experience, image: this.faculty.image,
      // date_of_birth: this.faculty.date_of_birth, date_of_joining: this.faculty.date_of_joining, first_name: this.faculty.first_name, 
      // middle_name: this.faculty.middle_name, last_name: this.faculty.last_name
      // }
    });
  }
}
