import { Component, OnInit, Inject} from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import {MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material';

// Components
import { CloseConfirmComponent } from '../../modals/close-confirm/close-confirm.component';

//Models
import{Application} from '../../../shared/application';

//Services
import {ResearchService} from '../../../services/research.service';

@Component({
    selector: 'app-submit-application',
    templateUrl: './submit-application.component.html',
    styleUrls: ['./submit-application.component.scss']
  })

  export class submitApplicationComponent implements OnInit {
    // change the type of student
    private student:any;
    // form control for submit application
    private application:Application;
    resumePreview:String;
    CVPreview: String;

    isLoading = false;
    form: FormGroup;

    constructor(
        private closeDialog: MatDialog,
        private researchService: ResearchService,
        public dialogRef: MatDialogRef<submitApplicationComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private snackBar: MatSnackBar,
      ) { }

      ngOnInit(){
        this.isLoading = true;
        this.form = new FormGroup({
          resume: new FormControl(null),
          CV:new FormControl(null)
        })

        // init new appliction
        this.application = {
          studentID: this.data.student._id,
          opportunityID: this.data.opt._id,
          resume: this.data.student.resume,
          coverLetter: this.data.student.CV,
          createTime:''
        }
        this.resumePreview = this.data.student.resume;
        this.CVPreview = this.data.student.CV;
        
        this.isLoading = false;
      }

      onFilePicked(event: Event, fileType:string) {
        const file = (event.target as HTMLInputElement).files[0];
        let mimeType = file.type;

        if(mimeType.match(/application\/*/) == null) {
          this.form.patchValue({fileType: []})
          this.snackBar.open( fileType + ' must be a .pdf, .doc, .docx, or google docs', 'Close', {
          duration: 3000,
          panelClass: 'error-snackbar'
          });
        }else{
          this.researchService.uploadFile(this.application.studentID,
            this.application.opportunityID,fileType,file)
            .then(response => {
              // update the application
              switch(fileType){
                case "resume":
                  this.resumePreview = response.location;
                  this.application.resume = response.location;
                  break;
                case "coverLetter":
                  this.CVPreview = response.location;
                  this.application.coverLetter = response.location;
                  break;
                }


              this.snackBar.open( 'File uploaded successful', 'Close', {
                duration: 3000,
                panelClass: 'success-snackbar'
              });

            });
        }
      }

      // onNoClick(): void {
      //   this.dialogRef.close();
      // }

      deleteFile(target:string){
        switch(target){
          case "resume":
            this.application.resume = '';
            this.resumePreview = '';
            this.form.patchValue({resume: []})
            break
          case "CV":
            this.application.coverLetter = '';
            this.CVPreview = '';
            this.form.patchValue({CV: []})
            break
        }
      }

      onSubmitApplication(){
        if( !this.application.resume || this.application.resume == '' ||
        !this.application.coverLetter || this.application.coverLetter == ''){
          this.snackBar.open( 'All file must be uploaded', 'Close', {
            duration: 3000,
            panelClass: 'error-snackbar'
          });
          return;
        }
        this.researchService.createApplication(this.application)
        .then(data =>{
          this.snackBar.open( 'Application create successful', 'Close', {
            duration: 3000,
            panelClass: 'success-snackbar'
          });
          this.dialogRef.close(data.applicationID);
        });
      }


    close() {
      let closeDialogRef = this.closeDialog.open(CloseConfirmComponent, {
        width: "500px"
      });

      closeDialogRef.afterClosed().subscribe(
        res => {
          if(res) {
            this.dialogRef.close();
          }
        }
      );
    }
}