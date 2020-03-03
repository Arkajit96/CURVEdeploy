import { OnInit, Input, Output, EventEmitter, Inject, Component } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { StudentService } from 'src/app/services/student.service';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { InterestList } from 'src/app/services/interest-list';
import { CloseConfirmComponent } from 'src/app/components/modals/close-confirm/close-confirm.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FacultyService } from 'src/app/services/faculty.service';


@Component({
  selector: 'app-add-interests',
  templateUrl: './add-interests.component.html',
  styleUrls: ['./add-interests.component.scss']
})
export class AddInterestsComponent implements OnInit {
  User: any;
  searchQuery = '';
  interests = [];
  interestControl = new FormControl();
  options = this.list.list;
  filteredOptions: Observable<any>;
  anyChanges = false;
  
  searchForm = this.fb.group({
    query: ['']
  });

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private facultyService: FacultyService,
    private list: InterestList,
    public dialogRef: MatDialogRef<AddInterestsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.User = this.data.User;
    this.interests = JSON.parse(JSON.stringify(this.User.interests));
    this.filteredOptions = this.interestControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  addInterest() {
    this.anyChanges = true;
    this.interests.push(this.interestControl.value);
    this.interestControl.setValue('');
  }

  deleteInterest(interest) {
    this.anyChanges = true;
    this.interests = this.interests.filter((val) => {
      return val !== interest;
    })
  }

  saveInterests() {
    console.log(this.User);
    if(this.User.research_summary != undefined) {
      this.saveFacultyInterest();
    } else {
      this.saveStudentInterest();
    }

   
    this.interestControl.setValue('');
  }

  saveStudentInterest() {
    this.studentService.editInterests(this.User.user_id, this.interests)
    .then((res) => {
      this.User = res;
      this.dialogRef.close(this.User);
    })
    .catch((e) => {
      console.log(e);
    })
  }

  saveFacultyInterest() {
    this.facultyService.editInterests(this.User.user_id, this.interests)
    .then((res) => {
      this.User = res;
      this.dialogRef.close(this.User);
    })
    .catch((e) => {
      console.log(e);
    })
  }

  close() {
    if(this.anyChanges) {
      let dialogRef = this.dialog.open(CloseConfirmComponent, {
        width: '400px'
      })

      dialogRef.afterClosed().subscribe(
        data => {
          if(data) {
            this.dialogRef.close();
            this.interests = JSON.parse(JSON.stringify(this.User.interests));
            this.searchForm.reset();
          }
        }
      )
    } else {
      this.dialogRef.close();
      this.interests = JSON.parse(JSON.stringify(this.User.interests));
      this.searchForm.reset();
    }
  }

  _filter(value) {
    if(value.trim() == '') {
      return []
    } else {
      const filterValue = value.toLowerCase();
      return this.options.filter(option => option.toLowerCase().includes(filterValue));
    }
  }

}
