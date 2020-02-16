import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-view-student-profile',
  templateUrl: './view-student-profile.component.html',
  styleUrls: ['./view-student-profile.component.scss']
})
export class ViewStudentProfileComponent implements OnInit {
  student: any;

  constructor(
    private dialogRef: MatDialogRef<ViewStudentProfileComponent>,
    @Inject(MAT_DIALOG_DATA) public Data: any
  ) { }

  ngOnInit() {
    this.student = this.Data.Data;
    console.log(this.student);
  }

}
