import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from "@angular/material";
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material';

//Components
import { ViewStudentProfileComponent } from '../modals/view-student-profile/view-student-profile.component'

// Service
import { StudentService } from 'src/app/services/student.service';
import { FacultyService } from 'src/app/services/faculty.service';
import { ResearchService } from 'src/app/services/research.service';
import { ChatService } from 'src/app/services/chat.service'

// Define row data 
export interface rowData {
  userId: string,
  applicationID: string,
  name: string,
  address: string,
  major: string,
  status: string
}


@Component({
  selector: 'app-candidate',
  templateUrl: './candidate.component.html',
  styleUrls: ['./candidate.component.scss']
})
export class CandidateComponent implements OnInit {
  isloadingPage = true;
  faculty: any;

  // Candidates controll
  private candidates: rowData[] = [];

  // data control
  dataSource = new MatTableDataSource<rowData>([]);
  @ViewChild(MatPaginator, { static: false }) set paginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }
  @ViewChild(MatSort, { static: false }) set Sort(sort: MatSort) {
    this.dataSource.sort = sort;
  }


  // columns that we want to display
  columnsToDisplay: string[] = ['name', 'address', 'major', 'actions', 'status'];

  // slider controll
  private checked = false;

  constructor(
    private studentService: StudentService,
    private facultyService: FacultyService,
    private researchService: ResearchService,
    private chatService: ChatService,
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
          this.dataSource = new MatTableDataSource<rowData>(this.candidates);

          this.isloadingPage = false;
        })
    }
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
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getFontColor(status: string) {
    switch (status) {
      case 'Submitted':
        return 'blue';
      case 'Accepted':
        return 'green';
      case 'Declined':
        return 'red';
    }

  }

  // View student profile
  viewProfile(userId: string, entity: string) {
    this.studentService.getStudentByUserId(userId)
      .then(student => {
        this.dialog.open(ViewStudentProfileComponent, {
          data: { user: student, entity: entity },
        })
      })
  }

  directMessage(element: any) {
    this.chatService.directMessage(element);
  }

  updateApplicationStatus(applicationID: string, status: string) {
    
    let message = ''

    this.researchService.updateApplicationStatus(applicationID, status)
      .then(res => {

        this.candidates.forEach(row => {
          if (row.applicationID === res.application._id) {
            row.status = res.application.status;

            if(status == 'Accepted'){
              message = "[System message] Congratulation! Your application to " + this.faculty.first_name + "'s lab has been accepted."
            }else{
              message = "[System message] We regret to inform you that your application to " + this.faculty.first_name + "'s lab has been declined."
            }

            this.chatService.sendMessage(this.faculty.user_id, row.userId, message);
          }
        })

        this.snackbar.open('Application status changed', 'Close', {
          duration: 3000,
          panelClass: 'success-snackbar'
        })
      })

  }

}
