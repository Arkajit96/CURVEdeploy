import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

// Service
import {CalendarService} from '../../../services/calendar.service'
import{ MicrosoftService } from '../../../services/microsoft.service';


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit{

  private loadingPage = false;

  constructor(
    private calendarService: CalendarService,
    private microsoftService: MicrosoftService,
    private snackbar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit() {
    // if (this.calendarService.getCurrentUserCode()){
    //   this.router.navigate(['/calendarSuccess'])
    // }
    // if(this.calendarService.getType() == 'curve') {
    //   this.router.navigate(['/calendarSuccess']);
    // }

    if(this.calendarService.getCalendarid()) {
      this.router.navigate(['/calendarSuccess']);
    }
  }

    googleOath(){
      this.calendarService.setType('google');
      this.calendarService.googleOath()
  }

  loadCurveCalendar() {
    this.calendarService.setType('curve');
    this.router.navigate(['/calendarSuccess']);
  }

  async loadMicrosoftCalendar() {
    this.loadingPage = true;
    await this.microsoftService.signIn();
    this.calendarService.setType('microsoft');

    this.microsoftService.getEvents()
      .then((events) => {
        console.log(events);
        this.microsoftService.saveMicrosoftEvents(events);
        this.loadingPage = false;
        this.router.navigate(['/calendarSuccess']);
      });
  }

  microsoftSignOut() {
    this.microsoftService.signOut();
  }

}
