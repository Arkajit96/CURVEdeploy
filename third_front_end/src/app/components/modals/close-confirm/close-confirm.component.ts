import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-close-confirm',
  templateUrl: './close-confirm.component.html',
  styleUrls: ['./close-confirm.component.scss']
})
export class CloseConfirmComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<CloseConfirmComponent>,
  ) { }

  ngOnInit() {
  }

  return() {
    this.dialogRef.close(false);
  }

  exit() {
    this.dialogRef.close(true);
  }

}
