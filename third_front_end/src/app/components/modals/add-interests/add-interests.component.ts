import { OnInit, Input, Output, EventEmitter, Inject, Component } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { StudentService } from 'src/app/services/student.service';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { InterestList } from 'src/app/services/interest-list';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


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
  
  searchForm = this.fb.group({
    query: ['']
  });

  // @Input() User: any;
  // @Output() Response: EventEmitter<any> = new EventEmitter()

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private list: InterestList,
    public dialogRef: MatDialogRef<AddInterestsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.User = this.data.User;
    let int = this.User.interests;
    this.interests = JSON.parse(JSON.stringify(this.User.interests));
    this.filteredOptions = this.interestControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  addInterest() {
    console.log(this.searchForm.controls.query.value);
    this.interests.push(this.searchForm.controls.query.value);
    this.searchForm.reset();
  }

  deleteInterest(interest) {
    console.log(interest);
    this.interests = this.interests.filter((val) => {
      return val !== interest;
    })
  }

  // saveInterests() {
  //   this.studentService.editInterests(this.User.user_id, this.interests)
  //   .then((res) => {
  //     console.log(res);
  //     // this.Response.emit({newInterests: res.interests});
  //   })
  //   .catch((e) => {
  //     console.log(e);
  //   })

  //   // this.Response.emit({newInterests: this.interests});
  //   this.searchForm.reset();
  // }

  // close() {
  //   this.interests = JSON.parse(JSON.stringify(this.User.interests));
  //   this.searchForm.reset();
  // }

  _filter(value) {
    const filterValue = value.toLowerCase();
    if(value.trim() == '') {
      return []
    } else {
      return this.options.filter(option => option.toLowerCase().includes(filterValue));
    }
  }

}
