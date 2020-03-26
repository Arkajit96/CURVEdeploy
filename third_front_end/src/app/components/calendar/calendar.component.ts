import { Component,OnInit } from '@angular/core';

@Component({
    selector: 'app-calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.scss']
  })
  export class CalendarComponent implements OnInit{

    now = new Date();
    year = this.now.getFullYear();
    month = this.now.getMonth();
    day = this.now.getDate();

    MonthEncode = []


     ngOnInit(){
    }

  }