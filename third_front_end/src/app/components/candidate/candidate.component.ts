import { Component, OnInit, ViewChild } from '@angular/core';
import { PageEvent, MatDialog, MatDialogConfig } from "@angular/material";
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material';

//Components
import { ViewStudentProfileComponent } from '../modals/view-student-profile/view-student-profile.component'

// Service
import { FacultyService } from 'src/app/services/faculty.service';
import { ResearchService } from 'src/app/services/research.service';

@Component({
  selector: 'app-candidate',
  templateUrl: './candidate.component.html',
  styleUrls: ['./candidate.component.scss']
})
export class CandidateComponent implements OnInit {
  isloadingPage = true;
  faculty: any;

  // Candidates controll
  private candidates = [];

  // data control
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;


  // columns that we want to display
  columnsToDisplay: string[] = ['name', 'address', 'major', 'actions'];

  // slider controll
  private checked = false;

  constructor(
    private facultyService: FacultyService,
    private researchService: ResearchService,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.faculty = this.facultyService.getCurrentFacultyUser();
    this.checked = this.faculty.available;


    // get candidates
    if (this.faculty.opportunity || this.faculty.opportunity != '') {
      this.researchService.getCandidates(this.faculty.opportunity)
      .then(res => {
        this.candidates = res;
        console.log(this.candidates);
        this.dataSource = new MatTableDataSource<any>(this.candidates);

        //add pagenation
        this.dataSource.paginator = this.paginator;
      })
    }


    this.isloadingPage = false;
    // this.route.params.subscribe((data) => {
    //   this.facultyId = data.id;
    //   this.facultyService.loadFaculty(this.facultyId)
    //   .then((res) => {
    //     this.faculty = res;
    //     this.loadingPage = false;
    //     setTimeout(this.setListeners, 1000);
    //   })
    //   .catch((e) => {
    //     console.log(e);
    //   })
    // })
  }

  onSliderChange() {
    this.facultyService.changeAvalibility(this.faculty.user_id, this.checked)
      .then((res) => {
        this.checked = res;
        this.faculty.available = res;

        this.snackbar.open('Change Availability to ' + res, 'Close', {
          duration: 3000,
          panelClass: 'success-snackbar'
        })
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // View student profile
  ViewProfile(student: any) {
    this.dialog.open(ViewStudentProfileComponent, {
      data: { Data: student },
    })
  }

  directMessage(person: any) {

    // Send message to person

    this.snackbar.open('Send message to ' + person.first_name, 'Close', {
      duration: 3000,
      panelClass: 'success-snackbar'
    })
  }

  // getCandidates() {
  //   if (!this.faculty.opportunity || this.faculty.opportunity == '') {
  //     return;
  //   }
  //   this.researchService.getCandidates(this.faculty.opportunity)
  //     .then(res => {
  //       this.candidates = res;
  //       console.log(this.candidates.length);
  //       this.dataSource = new MatTableDataSource<any>(this.candidates);

  //       //add pagenation
  //       this.dataSource.paginator = this.paginator;
  //     })
  // }

}
