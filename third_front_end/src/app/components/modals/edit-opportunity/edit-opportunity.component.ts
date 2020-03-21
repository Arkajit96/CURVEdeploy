import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { CloseConfirmComponent } from '../close-confirm/close-confirm.component';
import { MatSnackBar } from '@angular/material';


// Service
import { ResearchService } from '../../../services/research.service'
import { FacultyService } from '../../../services/faculty.service'



@Component({
    selector: 'app-edit-opportunity',
    templateUrl: './edit-opportunity.component.html',
    styleUrls: ['./edit-opportunity.component.scss']
})
export class EditOpportunityComponent implements OnInit {

    //maintaning data
    faculty: any;
    opportunity:any;

    // form control
    opportunityForm: any;
    isloading = false;
    previewImg: any;
    anyChanges = false;
    imgChanged = false;
    imageData: any;
    uploadImg = false;

    constructor(
        private dialog: MatDialog,
        public dialogRef: MatDialogRef<EditOpportunityComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private fb: FormBuilder,
        private snackBar: MatSnackBar,
        private facultyService: FacultyService,
        private researchService: ResearchService
    ) { }

    ngOnInit() {
        this.faculty = this.data.user;
        this.opportunity = this.data.opportunity;

        this.opportunityForm = this.fb.group({
            name: [this.opportunity.name],
            icon: [],
            expireTime: [this.opportunity.expireTime],
            summary: [this.opportunity.summary]
        })
    }

    submit() {
        if(this.uploadImg) {
          this.facultyService.uploadProfilePicture(this.faculty.user_id, this.imageData)
            .then((res) => {
              this.saveForm();
            })
            .catch((e) => {
              this.snackBar.open('Error uploading icon', 'Dismiss', {
                duration: 3000,
                panelClass: 'error-snackbar'
              })
            })
        } else {
          this.saveForm();
        }
      }
    
      saveForm() {
        this.facultyService.updateFaculty(this.faculty.user_id, this.opportunityForm.controls)
          .then((data) => {
            this.dialogRef.close();
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
          this.opportunityForm.patchValue({image: ''})
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