import { Component, OnInit, OnDestroy, Inject} from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import {MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Subscription } from "rxjs";
import { MatSnackBar } from '@angular/material';

//Models
import{Application} from '../../../shared/application';

//Services
import {AuthService} from '../../../services/auth.service';
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
    private resume: File  = null;
    private coverLetter:File = null;

    isLoading = false;
    form: any;

    constructor(
        private authService: AuthService,
        private researchService: ResearchService,
        public dialogRef: MatDialogRef<submitApplicationComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private fb: FormBuilder,
        private snackBar: MatSnackBar,
      ) { }

      ngOnInit(){
        this.isLoading = true;
        this.form = this.fb.group({
          resume: [],
          CV:[]
        })

        // init new appliction
        this.application = {
          studentID: this.data.student._id,
          opportunityID: this.data.opt.id,
          resume: this.data.student.resume,
          coverLetter: '',
          createTime:''
        }
        
        this.isLoading = false;
      }

      onResumePicked(event: Event) {
        const file = (event.target as HTMLInputElement).files[0];
        let mimeType = file.type;

        if(mimeType.match(/application\/*/) == null) {
          this.form.patchValue({resume: []})
          this.snackBar.open('Resume must be a .pdf, .doc, .docx, or google docs', 'Close', {
          duration: 3000,
          panelClass: 'error-snackbar'
          });
        }else{
          this.resume = file;
        }
      }

      onCVPicked(event: Event) {
        const file = (event.target as HTMLInputElement).files[0];
        let mimeType = file.type;

        if(mimeType.match(/application\/*/) == null) {
          this.form.patchValue({coverLetter: []})
          this.snackBar.open('Resume must be a .pdf, .doc, .docx, or google docs', 'Close', {
          duration: 3000,
          panelClass: 'error-snackbar'
          });
        }else{
          this.coverLetter = file;
        }
      }

      // onNoClick(): void {
      //   this.dialogRef.close();
      // }

      deleteFile(target:string){
        switch(target){
          case "resume":
            this.application.resume = '';
            this.resume = null;
            break
          case "CV":
            this.application.coverLetter = '';
            this.coverLetter = null;
            break
        }
      }

      onSubmitApplication(){
        // if(this.form.invalid){
        //   return;
        // }
        this.researchService.createApplication(this.application);
        // this.researchService.addToShoppingCart(this.application);
        if(this.resume != null){
          // this.studentService.uploadResume(this.authService.getUserId(), this.resume)
        }
        
        // this.isLoading = true;
      }
  }