import { Component} from '@angular/core';
import { Moment } from 'moment';
import * as moment from 'moment';
import { MatCalendar } from '@angular/material';
import { MatSnackBar } from '@angular/material';
import { times } from '../times';

// Service
import {CalendarService} from '../../../services/calendar.service'


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent{

  constructor(
    private calendarService: CalendarService,
    private snackbar: MatSnackBar
  ) { }

    googleOath(){
      this.calendarService.googleOath()
  }

}
