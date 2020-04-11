import { Component,OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';

// Service
import {CalendarService} from '../../../services/calendar.service'

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


    constructor(
      private calendarService: CalendarService,
      private snackbar: MatSnackBar
    ) { }


     ngOnInit(){
    }

    googleOath(){
      this.calendarService.googleOath()
    }

  }