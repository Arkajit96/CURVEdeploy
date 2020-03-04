import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { CloseConfirmComponent } from 'src/app/components/modals/close-confirm/close-confirm.component';
import { MatSnackBar } from '@angular/material';
import { FacultyService } from 'src/app/services/faculty.service';

@Component({
  selector: 'app-edit-factuly-profile',
  templateUrl: './edit-factuly-profile.component.html',
  styleUrls: ['./edit-factuly-profile.component.scss']
})
export class EditFactulyProfileComponent implements OnInit {
  faculty: any;
  facultyForm: any;
  loading = false;
  previewImg:any;
  anyChanges = false;
  imgChanged = false;
  imageData: any;
  uploadImg = false;

  constructor(
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<EditFactulyProfileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private facultyService: FacultyService
  ) { }

  ngOnInit() {
    this.faculty = this.data.user;
    console.log(this.faculty);

    this.facultyForm = this.fb.group({
      first_name: [this.faculty.first_name],
      last_name: [this.faculty.last_name],
      email: [this.faculty.email],
      gender: [this.faculty.gender],
      phone: [this.faculty.phone],
      education: [this.faculty.education],
      experience: [this.faculty.experience],
      department: [this.faculty.department],
      office: [this.faculty.address],
      image: []
    })
  }

  submit() {
    if(this.uploadImg) {
      this.facultyService.uploadProfilePicture(this.faculty.user_id, this.imageData)
        .then((res) => {
          this.saveFaculty();
        })
        .catch((e) => {
          this.snackBar.open('Error uploading image', 'Dismiss', {
            duration: 3000,
            panelClass: 'error-snackbar'
          })
        })
    } else {
      this.saveFaculty();
    }
  }

  saveFaculty() {
    this.facultyService.updateFaculty(this.faculty.user_id, this.facultyForm.controls)
      .then((data) => {
        this.dialogRef.close({faculty: data});
      })
      .catch((e) => {
        this.snackBar.open('Error Updating Student', 'Dismiss', {
          duration: 3000,
          panelClass: 'error-snackbar'
        });
      })
  }

  newPicture(fileInput: any) {
    this.imageData = <File>fileInput.target.files[0];

    let mimeType = this.imageData.type;
    if (mimeType.match(/image\/*/) == null) {
      this.facultyForm.patchValue({image: ''})
      this.snackBar.open('Must be a .png or .jpg file', 'Close', {
        duration: 3000,
        panelClass: 'error-snackbar'
      })
    } else {
      this.anyChanges = true;
      this.uploadImg = true;
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

  close() {
    if(this.anyChanges) {
      let dialogRef = this.dialog.open(CloseConfirmComponent, {
        width: "500px",
        hasBackdrop: false
      });
  
      dialogRef.afterClosed().subscribe(
        res => {
          if(res) {
            this.dialogRef.close();
          }
        }
      );
    }
    else {
      this.dialogRef.close();
    }
  }

  setChanged() {
    this.anyChanges = true;
  }

}