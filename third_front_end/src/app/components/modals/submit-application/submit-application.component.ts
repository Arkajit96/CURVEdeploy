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
        // const userId = this.authService.getUserId();
        this.form = new FormGroup({
          transcripts:new FormControl(null, {
            validators: [Validators.required]
          })
        });
        // this.studentService.getStudentByUserId(userId)
        // .then((res) => {
        //   this.student = res;
        //   this.isLoading = false;
        // });

        this.application = {
          studentID: this.data.student._id,
          opptunityID: this.data.opt.id,
          transcripts: [],
          letterOfRecommendations:[],
          statementOfInterests:[],
          otherDocs:[],
          createTime:''
        }

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

      onSubmitApplication(){
        // if(this.form.invalid){
        //   return;
        // }
        this.studentService.addToShoppingCart(this.application);
        // this.isLoading = true;
      }
  }