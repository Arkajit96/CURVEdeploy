import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.scss']
})
export class StudentProfileComponent implements OnInit {
  loadingPage = true;
  student_id:any
  student:any
  form: FormGroup
  fileToUpload: File = null;
  searchQuery: String = ""
  constructor(public route:ActivatedRoute, public http: HttpClient, public router: Router, private fb: FormBuilder) {
    this.createForm();
   }

   test() {
     console.log('HERE');
   }
  
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
        this.student = res;
        this.loadingPage = false;
      });
    });
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
  private prepareSave(): any {
    let input = new FormData();
    input.append('name', this.form.get('name').value);
    input.append('avatar', this.form.get('avatar').value);
    console.log(input['avatar']);
    return input;
  }

  edit() {
    console.log(this.student_id);
    this.router.navigate(['/editStudentProfile/'], {queryParams : {student_id: this.student._id}});
  }
  

  editTranscript() {
    
    // const formModel = this.prepareSave();
    // console.log(formModel);
    //const params = new HttpParams({fromObject: formModel});
    // const params = new HttpParams({fromObject: this.fileToUpload});
    const formData: FormData = new FormData();
    formData.append('fileKey', this.fileToUpload, this.fileToUpload.name);
    const reqHeader = new HttpHeaders({"content-type": "application/x-www-form-urlencoded"});
    // this.http.put("/api/student/edit/" + this.student_id, params, {headers:reqHeader, observe: "response"}
    this.http.post("/api/student/edit/resumes/" + this.student_id, formData, {headers: reqHeader, observe: "response"}).subscribe((res:any)=> {
      console.log(res);
    })
  }

  search() {
    console.log(this.searchQuery);
  }

  updateInterests(event) {
    console.log(event);
    this.student.interests = event.newInterests;
  }

}
