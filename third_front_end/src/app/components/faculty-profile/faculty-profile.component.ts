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

  onFileChange(event) {
    if(event.target.files.length > 0) {
      let file = event.target.files[0];
      this.fileToUpload = event.target.files[0];
      console.log(this.fileToUpload);
      this.form.get('avatar').setValue(file);
    }
  }

  // edit() {
  //   this.router.navigate(['/editFacultyProfile/'],
  //     {
  //       queryParams:
  //         { faculty_id: this.faculty_id }
        // {faculty_id: this.faculty._id, email: this.faculty.email,
        // gender: this.faculty.gender, address: this.faculty.address, phone: this.faculty.phone, summary: this.faculty.research_summary,
        // projects: this.faculty.current_projects,
        // department: this.faculty.department, education: this.faculty.education, experience: this.faculty.experience, image: this.faculty.image,
        // date_of_birth: this.faculty.date_of_birth, date_of_joining: this.faculty.date_of_joining, first_name: this.faculty.first_name, 
        // middle_name: this.faculty.middle_name, last_name: this.faculty.last_name
        // }
  //     });
  // }

  finishLoad() {
    this.loadingImg = false;
  }
}
