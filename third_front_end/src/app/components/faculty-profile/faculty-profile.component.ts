import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { AddInterestsComponent } from '../modals/add-interests/add-interests.component';
import { FacultyService } from 'src/app/services/faculty.service';
import { EditFactulyProfileComponent } from '../modals/edit-factuly-profile/edit-factuly-profile.component'

@Component({
  selector: 'app-faculty-profile',
  templateUrl: './faculty-profile.component.html',
  styleUrls: ['./faculty-profile.component.scss']
})
export class FacultyProfileComponent implements OnInit {
  faculty_id:any;
  faculty:any;
  constructor(public route:ActivatedRoute, 
    public http: HttpClient, 
    public router: Router,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    private facultyService: FacultyService
  ) { }

  ngOnInit() {
    this.faculty = {
      image: ""
    };
    this.route.params.subscribe((data) => {
      this.faculty_id = data.id;
      this.http.get("/api/faculty/" + this.faculty_id).subscribe((res:any) => {
        this.faculty = res;
        localStorage.setItem('faculty', JSON.stringify(this.faculty));
      })
    });
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
}
