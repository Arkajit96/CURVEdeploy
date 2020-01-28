import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { StudentService } from 'src/app/services/student.service';

@Component({
  selector: 'app-add-interests',
  templateUrl: './add-interests.component.html',
  styleUrls: ['./add-interests.component.scss']
})
export class AddInterestsComponent implements OnInit {
  searchQuery = '';
  interests = [];
  
  searchForm = this.fb.group({
    query: ['']
  });

  @Input() User: any;
  @Output() Response: EventEmitter<any> = new EventEmitter()

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService
  ) { }

  ngOnInit() {
    console.log(this.User);
    let int = this.User.interests;
    this.interests = JSON.parse(JSON.stringify(this.User.interests));
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

  saveInterests() {
    this.studentService.editInterests(this.User.user_id, this.interests)
    .then((res) => {
      console.log(res);
      this.Response.emit({newInterests: res.interests});
    })
    .catch((e) => {
      console.log(e);
    })

    // this.Response.emit({newInterests: this.interests});
    this.searchForm.reset();
  }

  close() {
    this.interests = JSON.parse(JSON.stringify(this.User.interests));
    this.searchForm.reset();
  }

}
