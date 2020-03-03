import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { CloseConfirmComponent } from 'src/app/components/modals/close-confirm/close-confirm.component';
import { MatSnackBar } from '@angular/material';
import { StudentService } from 'src/app/services/student.service';

@Component({
  selector: 'app-edit-student-profile',
  templateUrl: './edit-student-profile.component.html',
  styleUrls: ['./edit-student-profile.component.scss']
})
export class EditStudentProfileComponent implements OnInit {
  student: any;
  studentForm: any;
  resumeData: any;
  imageData: any;
  previewImg: any;
  uploadImage = false;
  uploadResume = false;
  loading: boolean = true;
  anyChanges = false;
  imgChanged = false;

  constructor(
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<EditStudentProfileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private studentService: StudentService
  ) { }

  ngOnInit() {
    this.student = this.data.User;
    console.log(this.student);
    this.studentForm = this.fb.group({
      first_name: [this.student.first_name],
      last_name: [this.student.last_name],
      major: [this.student.major],
      minor: [this.student.minor],
      email: [this.student.email],
      gender: [this.student.gender],
      dob: [this.student.date_of_birth],
      phone: [this.student.phone],
      class: [this.student.graduation_class],
      profilePic: [],
      resume: []
    })
    this.loading = false;
  }

  submit() {
    this.loading = true;
    console.log(this.studentForm);
    if(this.uploadImage) {
      this.studentService.uploadProfilePicture(this.student.user_id, this.imageData)
      .then((res) => {
        this.imgChanged = true;

        console.log('upload resume');

        if(this.uploadResume) {
          this.studentService.uploadFile(this.student.user_id, this.resumeData, 'resume')
          .then((res) => {
            this.student = res;
            this.saveUpdates();
          }).catch((e) => {this.snackBar.open(e.error, 'Close', {duration:3000, panelClass:'error-snackbar'})});
        } else {
          this.student = res;
          this.saveUpdates();
        }
        // this.dialogRef.close({student: this.student, imgChanged: this.imgChanged});
      })
      .catch((e) => {
        console.log(e);
        this.snackBar.open(e.error, 'Close', {duration: 3000, panelClass: 'error-snackbar'});
      });
    } else {
        if(this.uploadResume) {
          this.studentService.uploadFile(this.student.user_id, this.resumeData, 'resume')
          .then((res) => {
            this.student = res;
            this.saveUpdates();
          }).catch((e) => {this.snackBar.open(e.error, 'Close', {duration:3000, panelClass:'error-snackbar'})});
        } else {
          this.saveUpdates();
        }
    }

  }

  saveUpdates() {
    this.studentService.updateStudent(this.student.user_id, this.studentForm.controls)
    .then((data) => {
      this.dialogRef.close({student: data, imgChanged: this.imgChanged});
    }).catch((e) => {
      this.dialogRef.close({error: e});
    })
  }

  newResume(fileInput: any) {
    this.resumeData = <File>fileInput.target.files[0];
    let mimeType = this.resumeData.type;

    if(mimeType.match(/application\/*/) == null) {
      this.studentForm.patchValue({resume: ''})
      this.snackBar.open('Resume must be a .pdf, .doc, .docx, or google docs', 'Close', {
        duration: 3000,
        panelClass: 'error-snackbar'
      });
    } else {
      this.anyChanges = true;
      this.uploadResume = true;
    }
  }
 
  newPicture(fileInput: any) {
    this.imageData = <File>fileInput.target.files[0];

    let mimeType = this.imageData.type;
    if (mimeType.match(/image\/*/) == null) {
      this.studentForm.patchValue({profilePic: ''})
      this.snackBar.open('Must be a .png or .jpg file', 'Close', {
        duration: 3000,
        panelClass: 'error-snackbar'
      })
    } else {
      this.anyChanges = true;
      this.uploadImage = true;
    }

    this.previewProfilePic();
  }

  previewProfilePic() {
    const reader = new FileReader();
    reader.readAsDataURL(this.imageData); 
    reader.onload = (_event) => { 
      this.previewImg = reader.result; 
    }
  }

  setChanged() {
    this.anyChanges = true;
  }

  close() {
    if(this.anyChanges) {
      let dialogRef = this.dialog.open(CloseConfirmComponent, {
        width: "500px"
      });
  
      dialogRef.afterClosed().subscribe(
        res => {
          if(res) {
            this.dialogRef.close({student: this.student, imgChanged: this.imgChanged});
          }
        }
      );
    }
    else {
      this.dialogRef.close({student: this.student, imgChanged: this.imgChanged});
    }
  }

}
