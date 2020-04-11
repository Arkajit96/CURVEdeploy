import { Component, OnInit } from '@angular/core';
import { PageEvent, MatDialog, MatDialogConfig } from "@angular/material";
import { MatSnackBar } from '@angular/material';

// Components
import { ViewStudentProfileComponent } from '../modals/view-student-profile/view-student-profile.component'

// Service
import { FacultyService } from '../../services/faculty.service';
import { ChatService } from 'src/app/services/chat.service'

@Component({
  selector: 'app-canidate-search',
  templateUrl: './canidate-search.component.html',
  styleUrls: ['./canidate-search.component.scss']
})
export class CanidateSearchComponent implements OnInit {
  // loadingSearch: boolean = true;
  // showSearch: boolean = false;
  // loadingFilter = false;
  // filter = 'People'
  // candidates = [];
  // searchResults: any;
  // showPeople = [];
  searchQuery: String = '';
  searchResults = [];
  filter = "People";
  isloading = true;
  loadingSearch = false;

  constructor(
    private facultyService: FacultyService,
    private chatService: ChatService,
    private dialog: MatDialog,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit() {
    // Load Canditates;

    let searchBar = document.getElementById("searchBar");
    let searchLink = document.getElementById('searchLink');

    searchBar.addEventListener("keyup", (event) => {
      if (event.keyCode === 13) {
        event.preventDefault();
        searchLink.click();
      }
    })
    this.isloading = false;
  }

  search() {
    if (this.searchQuery.trim() !== '') {
      this.loadingSearch = true;
      this.facultyService.search(this.searchQuery)
        .then((res) => {
          this.searchResults = res;
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

  ViewProfile() {
    // this.dialog.open(ViewStudentProfileComponent, {
    //   data: { Data: this.student },
    // })
  }

  directMessage(user: any) {
    this.chatService.directMessage(user);
  }

}
