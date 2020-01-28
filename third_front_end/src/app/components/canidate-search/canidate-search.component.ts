import { Component, Input, OnChanges, SimpleChange, SimpleChanges, OnInit } from '@angular/core';
import { FacultyService } from '../../services/faculty.service';

@Component({
  selector: 'app-canidate-search',
  templateUrl: './canidate-search.component.html',
  styleUrls: ['./canidate-search.component.scss']
})
export class CanidateSearchComponent implements OnInit, OnChanges {
  loadingSearch: boolean = true;
  showSearch: boolean = false;
  loadingFilter = false;
  filter = 'People'
  candidates = [];
  searchResults: any;
  showPeople = [];
  
  @Input() searchQuery: String;

  constructor(
    private facultyService: FacultyService
  ) { }

  ngOnInit() {
    // Load Canditates;
    this.loadingSearch = false;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.search(changes.searchQuery.currentValue);
  }

  search(query: String) {
    console.log(query);
    if(query.trim() !== ''){
      this.loadingSearch = true;
      this.facultyService.search(this.searchQuery)
      .then((res) => {
        console.log(res);
        this.searchResults = res;
        this.showPeople = res.names;
        if(this.showPeople.length == 0) {
          this.showPeople = res.departments;
        }
        this.loadingSearch = false;
        this.showSearch = true;
      })
    } else {
      this.loadingSearch = true;
      this.showSearch = false;
      this.loadingSearch = false;
    }
  }

  changeFilter(filter: string) {
    this.loadingFilter = false;
    if(filter == 'People') {
      this.filter = filter;
      this.showPeople = this.searchResults.names
      console.log(this.showPeople);
    } else if (filter == 'Department') {
      this.filter = filter;
      this.showPeople = this.searchResults.departments
    }
    this.loadingFilter = false;
    // this.showPeople = this.searchResults.departments;
  }

}
