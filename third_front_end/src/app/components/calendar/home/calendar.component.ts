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
export class CalendarComponent implements OnInit {

  private loadingPage = false;

  constructor(
    private calendarService: CalendarService,
    private microsoftService: MicrosoftService,
    private snackbar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit() {
    // use sync state to navigate
    if (this.calendarService.getState().syncState) {
      this.router.navigate(['/calendarSuccess'])
    }
  }

  googleOath() {
    this.calendarService.googleOath()
  }

  noOathCalendar() {
    this.router.navigate(['/calendarSuccess'])
  }

  iCloudOath(){
    this.calendarService.getICloudEvents();
  }

  async loadMicrosoftCalendar() {
    this.loadingPage = true;
    await this.microsoftService.signIn();

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
