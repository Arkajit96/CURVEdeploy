import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

// Service
import {CalendarService} from '../../../services/calendar.service'


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit{

  constructor(
    private calendarService: CalendarService,
    private snackbar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit() {
    if (this.calendarService.getCurrentUserCode()){
      this.router.navigate(['/calendarSuccess'])
    }
}

    googleOath(){
      this.calendarService.googleOath()
  }

}
