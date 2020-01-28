import { Component, OnInit } from '@angular/core';
import { StudentService } from 'src/app/services/student.service';

@Component({
  selector: 'app-research',
  templateUrl: './research.component.html',
  styleUrls: ['./research.component.scss']
})
export class ResearchComponent implements OnInit {
  searchQuery: String = '';
  searchResults = [];
  filter = "People";
  loadingSearch = false;

  constructor(
    private studentService: StudentService
  ) { }

  ngOnInit() {
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

}
