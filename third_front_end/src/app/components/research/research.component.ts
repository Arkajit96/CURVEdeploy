import { Component, OnInit, OnDestroy} from '@angular/core';
import { PageEvent, MatDialog, MatDialogConfig } from "@angular/material";
import { Subscription, fromEventPattern } from "rxjs";

//Modals
import{submitApplicationComponent} from '../modals/submit-application/submit-application.component'

//Models
import{Opportunity} from '../../shared/opportunity';

//Service
import {AuthService} from '../../services/auth.service';
import { StudentService } from '../../services/student.service';

@Component({
  selector: 'app-research',
  templateUrl: './research.component.html',
  styleUrls: ['./research.component.scss']
})
export class ResearchComponent implements OnInit, OnDestroy{

  isLoading = false;

  //Fields for opportunities
  opportunities: Opportunity[] = [];
  private opportunitiesSub: Subscription;

  //Fields for shopping cart
  student:any;
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
    private authService: AuthService,
    private studentService: StudentService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.isLoading = true;

    // shopping cart part
    const userId = this.authService.getUserId();
    this.studentService.getStudentByUserId(userId)
    .then((res) => {
        this.student = res;
        this.shopping_cart = this.student.shopping_cart;
        console.log(this.student);

        //lab part
        this.studentService.getOppurtunities(this.numPerPage, this.currentPage);
        this.opportunitiesSub = this.studentService.getopportunitiesUpdatedListener()
        .subscribe((data: { opportunities:Opportunity[]; count: number }) => {
            this.totalNum = data.count;
            this.opportunities = data.opportunities;
        });
        
        this.isLoading = false;
    });
    

    //search part
    // this.isLoading = true;
    let searchBar = document.getElementById("searchBar");
    let searchLink = document.getElementById('searchLink');
    
    searchBar.addEventListener("keyup", (event) => {
      if(event.keyCode === 13) {
        event.preventDefault();
        searchLink.click();
      }
    })
  }

  search() {
    if(this.searchQuery.trim() !== ''){
      this.loadingSearch = true;
      this.studentService.search(this.searchQuery)
      .then((res) => {
        this.searchResults = res;
        this.searchQuery = ''
        this.filter = 'People';
        console.log(this.searchResults);
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
    this.studentService.getOppurtunities(this.numPerPage, this.currentPage);
  }

  // quick apply dialog
     openApplicationDialog(index:number) {
      const currentOpt = this.opportunities[index];

      const dialogConfig = new MatDialogConfig();
  
      dialogConfig.autoFocus = false;
      dialogConfig.data = {
        opt: currentOpt,
        student:this.student
      }
  
      this.dialog.open(submitApplicationComponent, dialogConfig);
  }


  ngOnDestroy() {
    this.opportunitiesSub.unsubscribe();
  }

}
