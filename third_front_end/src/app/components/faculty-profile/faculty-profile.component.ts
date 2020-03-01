import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FacultyService } from 'src/app/services/faculty.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-faculty-profile',
  templateUrl: './faculty-profile.component.html',
  styleUrls: ['./faculty-profile.component.scss']
})
export class FacultyProfileComponent implements OnInit {
  isloadingPage = true;
  faculty: any;

  form: FormGroup

  // fields used for updating
  fileToUpload: File = null;
  newResearchSummary: String;
  loadingImg = true;

  constructor(
    public route: ActivatedRoute, 
    public http: HttpClient, 
    public router: Router,   
    private fb: FormBuilder,
    private dialog: MatDialog, 
    private facultyService: FacultyService,
    private snackbar: MatSnackBar) { 
      this.createForm();
    }

  ngOnInit() {
    this.faculty = this.facultyService.getCurrentFacultyUser();
    this.newResearchSummary = this.faculty.research_summary;
    this.isloadingPage = false;
    // this.route.params.subscribe((data) => {
    //   this.faculty_id = data.id;
    //   //console.log(this.faculty_id);
    //   console.log("route successfully" + JSON.stringify(this.faculty_id));
    //   // const params = new HttpParams({fromObject: {id: this.student_id}});
    //   // const reqHeader = new HttpHeaders({"content-type": "application/x-www-form-urlencoded"});
    //   this.http.get("/api/faculty/" + this.faculty_id).subscribe((res:any) => {
    //     console.log(res)
    //     this.faculty = res;
    //   })
    // });
  }

  createForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      avatar: null
    });
  }

  onFileChange(event) {
    if(event.target.files.length > 0) {
      let file = event.target.files[0];
      this.fileToUpload = event.target.files[0];
      console.log(this.fileToUpload);
      this.form.get('avatar').setValue(file);
    }
  }

  // edit() {
  //   this.router.navigate(['/editFacultyProfile/'],
  //     {
  //       queryParams:
  //         { faculty_id: this.faculty_id }
        // {faculty_id: this.faculty._id, email: this.faculty.email,
        // gender: this.faculty.gender, address: this.faculty.address, phone: this.faculty.phone, summary: this.faculty.research_summary,
        // projects: this.faculty.current_projects,
        // department: this.faculty.department, education: this.faculty.education, experience: this.faculty.experience, image: this.faculty.image,
        // date_of_birth: this.faculty.date_of_birth, date_of_joining: this.faculty.date_of_joining, first_name: this.faculty.first_name, 
        // middle_name: this.faculty.middle_name, last_name: this.faculty.last_name
        // }
  //     });
  // }

  finishLoad() {
    this.loadingImg = false;
  }
}
