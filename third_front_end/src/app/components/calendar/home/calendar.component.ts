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
    // if (this.calendarService.getCurrentUserCode()){
    //   this.router.navigate(['/calendarSuccess']
      //   queryParams: {
      //     source: 'google'
      //   },
      //   skipLocationChange: true 
      // })
      // )}

    //   this.router.navigate(['/calendarSuccess'])
    // }
    // if(this.calendarService.getType() == 'curve') {
    //   this.router.navigate(['/calendarSuccess']);
    // }

    if(this.calendarService.getCalendarid()) {
      this.router.navigate(['/calendarSuccess']);
    }

    // use sync state to navigate
      // if (this.calendarService.getSyncState()){
      //   this.router.navigate(['/calendarSuccess'])
      // }
  }

    googleOath(){
      this.calendarService.setType('google');
      this.calendarService.googleOath()
  }

  noOathCalendar(){
      this.router.navigate(['/calendarSuccess'])
  }


  loadCurveCalendar() {
    this.calendarService.setType('curve');
    this.router.navigate(['/calendarSuccess']);
  }

}
