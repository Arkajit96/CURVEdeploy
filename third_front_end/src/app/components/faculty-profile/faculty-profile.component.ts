import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { AddInterestsComponent } from '../modals/add-interests/add-interests.component';
import { EditFactulyProfileComponent } from '../modals/edit-factuly-profile/edit-factuly-profile.component'
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FacultyService } from 'src/app/services/faculty.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-faculty-profile',
  templateUrl: './faculty-profile.component.html',
  styleUrls: ['./faculty-profile.component.scss']
})
export class FacultyProfileComponent implements OnInit {
  faculty:any;
  fileToUpload: any;
  loadingImg = false;
  constructor(public route:ActivatedRoute, 
    public http: HttpClient, 
    public router: Router,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    private facultyService: FacultyService
  ) { }

  ngOnInit() {
    this.faculty = this.facultyService.getCurrentFacultyUser();
  }
  edit() {
    let dialog = this.dialog.open(EditFactulyProfileComponent, {
      width: '550px',
      data: {user: this.faculty}
    })

    dialog.afterClosed().subscribe(
      data => {
        if(data.faculty) {
          this.faculty = data.faculty
          this.snackbar.open("Profile Updated", 'Dismiss', {
            duration: 3000,
            panelClass: 'success-snackbar'
          })
        }
      }
    )
  }

  saveSummary() {
    this.facultyService.updateSummary(this.faculty.user_id, this.faculty.research_summary, this.faculty.current_projects)
      .then((data) => {
        this.faculty = data;
        this.snackbar.open("Summary info updated", "Dismiss", {
          panelClass: 'success-snackbar',
          duration: 3000
        });
      })
      .catch((e) => {
        this.snackbar.open('Error updating summary', 'Dismiss', {
          panelClass: 'error-snackbar',
          duration: 3000
        });
      })
  } 

  openInterestsDialog() {
    const dialogRef = this.dialog.open(AddInterestsComponent, {
      width: '500px',
      data: {User: this.faculty}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.faculty = result;
        this.snackbar.open('Interests saved', 'Close', {
          duration: 3000,
          panelClass: 'success-snackbar'
        });
      }
    })
  }

  onFileChange(event) {
    if(event.target.files.length > 0) {
      let file = event.target.files[0];
      this.fileToUpload = event.target.files[0];
      console.log(this.fileToUpload);
    }
  }

  finishLoad() {
    this.loadingImg = false;
  }
}
