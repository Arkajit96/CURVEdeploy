import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { AddInterestsComponent } from '../modals/add-interests/add-interests.component';
import { EditStudentProfileComponent } from '../modals/edit-student-profile/edit-student-profile.component';
import { ViewStudentProfileComponent } from '../modals/view-student-profile/view-student-profile.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { StudentService } from 'src/app/services/student.service';
import { MatSnackBar } from '@angular/material';

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
  newSummary: String;
  loadingImg = true;

  constructor(
    public route:ActivatedRoute, 
    public router: Router, 
    private fb: FormBuilder,
    private dialog: MatDialog,
    private studentService: StudentService,
    private snackbar: MatSnackBar
  ) {
    this.createForm();
   }

   testViewProfile() {
     this.dialog.open(ViewStudentProfileComponent, {
       data: {Data: this.student},
     
     })
   }
  
  ngOnInit() {
    this.route.params.subscribe((data) => {
      this.student_id = data.id;
      this.studentService.getStudent(this.student_id)
      .then((res) => {
        this.student = res;
        this.newSummary = res.summary;
      .catch((e) => {
          console.log(e);
          this.snackbar.open('Error loading student.', 'Close', {panelClass: 'error-snackbar'});
        })
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

  saveSummary() {
    this.studentService.updateSummary(this.student.user_id, this.newSummary)
    .then((data) => {
      this.student.summary = data.summary;
      this.newSummary = data.summary;
      this.snackbar.open("Summary Updated", "Close", {
        duration: 3000,
        panelClass: "success-snackbar"
      });
    })
    .catch((e) => {
      console.log(e);
    })
  }

  edit() {
    const dialogRef = this.dialog.open(EditStudentProfileComponent, {
      width: '550px',
      data: {User: this.student}
    });

    dialogRef.afterClosed().subscribe(
      data => {
        if(data && !data.error){
          this.student = data.student;
          this.snackbar.open('Student info updated', 'Close', {
            duration: 3000,
            panelClass: 'success-snackbar'
          })
        } else {
          if(data.error){
            this.snackbar.open(data.error, 'Close', {
              duration: 3000,
              panelClass: 'error-snackbar'
            })
          }
        }
        // this.student = data;
      }
    )
  }

  openInterestsDialog() {
    const dialogRef = this.dialog.open(AddInterestsComponent, {
      width: '500px',
      data: {User: this.student}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.student = result;
        this.snackbar.open('Interests saved', 'Close', {
          duration: 3000,
          panelClass: 'success-snackbar'
        });
      }
    })
  }

  finishLoad() {
    this.loadingImg = false;
  }

}
