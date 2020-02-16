import { Component, OnInit, OnDestroy, Inject} from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import {MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Subscription } from "rxjs";

//Models
import{Application} from '../../../shared/application';

//Services
import {AuthService} from '../../../services/auth.service';
import {StudentService} from '../../../services/student.service';

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
    private resume: string;
    private coverLetter:string;

    isLoading = false;
    form: FormGroup;

    constructor(
        private authService: AuthService,
        private studentService: StudentService,
        public dialogRef: MatDialogRef<submitApplicationComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
      ) { }

      ngOnInit(){
        this.isLoading = true;
        this.form = new FormGroup({
          transcripts:new FormControl(null, {
            validators: [Validators.required]
          })
        });

        // init new appliction
        this.application = {
          studentID: this.data.student._id,
          opptunityID: this.data.opt.id,
          resume:this.data.student.resume,
          coverLetter: '',
          createTime:''
        }
        this.resume = this.data.student.resume;
        this.coverLetter = '';
        
        this.isLoading = false;
      }

      onFilePicked(event: Event) {
        const file = (event.target as HTMLInputElement).files[0];
        const reader = new FileReader();
        reader.onload = ()=>{

        }
        reader.readAsDataURL(file);
      }

      // onNoClick(): void {
      //   this.dialogRef.close();
      // }

      deleteFile(target:string){
        
      }

      onSubmitApplication(){
        // if(this.form.invalid){
        //   return;
        // }
        this.studentService.addToShoppingCart(this.application);
        // this.isLoading = true;
      }
  }