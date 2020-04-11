import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent, MatDialog, MatDialogConfig } from "@angular/material";
import { Subscription } from "rxjs";
import { MatSnackBar } from '@angular/material';

// Components
import { submitApplicationComponent } from '../modals/submit-application/submit-application.component'
import { ViewStudentProfileComponent } from '../modals/view-student-profile/view-student-profile.component'

//Models
import { Opportunity } from '../../shared/opportunity';

//Service
import { StudentService } from '../../services/student.service';
import { ResearchService } from '../../services/research.service';
import { ChatService } from 'src/app/services/chat.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-research',
  templateUrl: './research.component.html',
  styleUrls: ['./research.component.scss']
})
export class ResearchComponent implements OnInit, OnDestroy {

  isLoading = true;

  //Fields for opportunities
  opportunities: Opportunity[] = [];
  private opportunitiesSub: Subscription;

  //Fields for shopping cart
  student: any;
  private shopping_cart = [];

  // Pageinate
  totalNum = 0;
  numPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];

  //Fields for search
  searchQuery: String = '';
  searchResults = [];
  filter = "People";
  loadingSearch = false;

  constructor(
    private researchService: ResearchService,
    private studentService: StudentService,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    private chatService: ChatService,
    private router: Router
  ) { }

  ngOnInit() {
    // Directlt get student from the service
    this.student = this.studentService.getCurrentStudentUser();
    this.shopping_cart = this.student.shopping_cart;

    

    //lab part
    this.researchService.getOppurtunities(this.numPerPage, this.currentPage);
    this.opportunitiesSub = this.researchService.getopportunitiesUpdatedListener()
      .subscribe((data: { opportunities: Opportunity[]; count: number }) => {
        this.totalNum = data.count;
        this.opportunities = data.opportunities;
      });

    this.isLoading = false;

    // new opt part
    // const userId = this.authService.getUserId();
    // this.studentService.getStudentByUserId(userId)
    // .then((res) => {
    //     this.student = res;
    //     this.shopping_cart = this.student.shopping_cart;

    //     //lab part
    //     this.researchService.getOppurtunities(this.numPerPage, this.currentPage);
    //     this.opportunitiesSub = this.researchService.getopportunitiesUpdatedListener()
    //     .subscribe((data: { opportunities:Opportunity[]; count: number }) => {
    //         this.totalNum = data.count;
    //         this.opportunities = data.opportunities;
    //     });

    //     this.isLoading = false;
    // });


    //search part
    // this.isLoading = true;
    let searchBar = document.getElementById("searchBar");
    let searchLink = document.getElementById('searchLink');

    searchBar.addEventListener("keyup", (event) => {
      if (event.keyCode === 13) {
        event.preventDefault();
        searchLink.click();
      }
    })
  }

  search() {
    if (this.searchQuery.trim() !== '') {
      this.loadingSearch = true;
      this.studentService.search(this.searchQuery)
        .then((res) => {
          this.searchResults = res;
          console.log(this.searchResults);
          this.searchQuery = ''
          this.filter = 'People';
          this.loadingSearch = false;
        })
        .catch((e) => {
          console.log(e);
        })
    }
  }

  filterBy(filter: string) {
    this.filter = filter;
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.numPerPage = pageData.pageSize;
    this.researchService.getOppurtunities(this.numPerPage, this.currentPage);
  }

  findOptAndOpenDialog(optID: string) {
    this.researchService.getApplicationInfo(this.student._id, optID)
      .then(data => {
        this.openApplicationDialog(data);
      });
  }

  // Handle quick apply dialog
  openApplicationDialog(data: any) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = false;
    dialogConfig.width = "200em";
    dialogConfig.data = {
      opt: data.currentOpt,
      student: this.student,
      application:data.application
    }

    let dialogRef = this.dialog.open(submitApplicationComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.snackbar.open('Application submitted', 'Close', {
          duration: 3000,
          panelClass: 'success-snackbar'
        })
      }
    })
  }

  addToShoppingCart(person: any) {
    if (this.student.shopping_cart.includes(person._id)) {
      this.snackbar.open('Faculty ' + person.first_name + ' already added to the shopping cart', 'Close', {
        duration: 3000,
        panelClass: 'info-snackbar'
      })
      return;
    }
    this.studentService.addToShoppingCart(this.student.user_id, person._id)
      .then(res => {
        this.student = res.student;
        this.shopping_cart = res.student.shopping_cart;
        this.snackbar.open('Faculty ' + person.first_name + ' added to the shopping cart', 'Close', {
          duration: 3000,
          panelClass: 'success-snackbar'
        })
      });
  }

  ViewProfile(user) {
    this.dialog.open(ViewStudentProfileComponent, {
      data: { 
        user: user,
        entity: 'faculty',
      },
    })
  }

  directMessage(faculty) {
    this.chatService.directMessage(faculty);
  }


  ngOnDestroy() {
    this.opportunitiesSub.unsubscribe();
  }

}
