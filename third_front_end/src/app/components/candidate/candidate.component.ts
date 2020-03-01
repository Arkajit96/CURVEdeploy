import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FacultyService } from 'src/app/services/faculty.service';

@Component({
  selector: 'app-candidate',
  templateUrl: './candidate.component.html',
  styleUrls: ['./candidate.component.scss']
})
export class CandidateComponent implements OnInit, AfterViewInit {
  isloadingPage = true;
  loadingSearch = false;
  faculty: any;
  searchQuery = '';

  query = "";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private facultyService: FacultyService
  ) { }

  ngOnInit() {
    this.faculty = this.facultyService.getCurrentFacultyUser();
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

  ngAfterViewInit() {
    setTimeout(this.setListeners, 1000);
  }

  setListeners() {
    let searchBar = document.getElementById("search_bar");
    let searchLink = document.getElementById('searchLink');
    
    searchBar.addEventListener("keyup", (event) => {
      if(event.keyCode === 13) {
        event.preventDefault();
        searchLink.click();
      }
    })
  }

  search() {
    // willl trigger search inside app-canidate-search
    this.query = this.searchQuery;
  }

}
