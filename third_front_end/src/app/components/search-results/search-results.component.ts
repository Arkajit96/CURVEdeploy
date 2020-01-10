import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { StudentService } from 'src/app/services/student.service';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit {
  query: string;
  results: any = {};
  loadingPage: boolean = true;
  newSearchQuery: String = "";
  filter: String = "People";

  constructor(
    public route:ActivatedRoute, 
    public http: HttpClient, 
    public router: Router,
    public studentService: StudentService
  ) { }

  ngOnInit() {
    this.route.params.subscribe((data) => {
      this.query = data.query;
      console.log(this.query);
      this.studentService.search(this.query)
      .then((res) => {
        this.results = res;
        console.log(this.results);
        this.loadingPage = false;
      })
      .catch((e) => {
        console.log('ERROR' + e);
      })
    });
  }

  newSearch() {
    console.log(this.newSearchQuery);
    if(this.newSearchQuery.trim() !== "" && this.newSearchQuery !== " ") {
      this.loadingPage = true;
      // // this.filter = "People";
      // this.router.navigate([`/searchResults/${this.newSearchQuery}`]);
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([`/searchResults/${this.newSearchQuery}`]);
    }); 
    }
  }

  filterBy(filterby: String) {
    this.filter = filterby;
  }

}
