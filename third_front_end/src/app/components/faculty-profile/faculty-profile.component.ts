import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material';

// Services
import { FacultyService } from '../../services/faculty.service';
import { ResearchService } from '../../services/research.service';

// Components
import { AddInterestsComponent } from '../modals/add-interests/add-interests.component';
import { EditFacultyProfileComponent } from '../modals/edit-faculty-profile/edit-faculty-profile.component'
import { EditOpportunityComponent } from '../modals/edit-opportunity/edit-opportunity.component'


@Component({
  selector: 'app-faculty-profile',
  templateUrl: './faculty-profile.component.html',
  styleUrls: ['./faculty-profile.component.scss']
})
export class FacultyProfileComponent implements OnInit {
  fileToUpload: any;
  loadingImg = true;

  // store faculty
  faculty: any;

  // store Opportunity
  opportunity = null;
  loadingOpt = true;


  constructor(
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    private facultyService: FacultyService,
    private researchService: ResearchService
  ) { }

  ngOnInit() {
    this.faculty = this.facultyService.getCurrentFacultyUser();
    if (this.faculty.opportunity) {
      this.researchService.getOptByIds(this.faculty.opportunity)
        .then(res => {
          this.opportunity = res;
          this.finishLoad();
        })
    } else {
      this.finishLoad();
    }
  }
  edit() {
    let dialog = this.dialog.open(EditFacultyProfileComponent, {
      width: '550px',
      data: { user: this.faculty },
      disableClose: true
    })

    dialog.backdropClick().subscribe(() => {
      // Close the dialog
      dialog.close({ faculty: this.faculty });
    })

    dialog.afterClosed().subscribe(
      data => {
        if (data.faculty) {
          this.faculty = data.faculty
        }
      }
    )
  }

  createOreditopportunity() {
    let dialog = this.dialog.open(EditOpportunityComponent, {
      width: '100rm',
      data: { user: this.faculty, opportunity: this.opportunity },
      disableClose: true
    })

    dialog.backdropClick().subscribe(() => {
      dialog.close({
        faculty: null,
        opportunity: null
      });
    })

    dialog.afterClosed().subscribe(
      data => {
        if (data.faculty && data.opportunity) {
          this.faculty = data.faculty;
          this.opportunity = data.opportunity;
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
      data: { User: this.faculty }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.faculty = result;
        this.snackbar.open('Interests saved', 'Close', {
          duration: 3000,
          panelClass: 'success-snackbar'
        });
      }
    })
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      let file = event.target.files[0];
      this.fileToUpload = event.target.files[0];
      console.log(this.fileToUpload);
    }
  }

  finishLoad() {
    this.loadingImg = false;
    this.loadingOpt = false;
  }
}
