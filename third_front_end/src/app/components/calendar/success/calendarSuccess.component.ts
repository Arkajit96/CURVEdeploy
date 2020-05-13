
import { Component, Output, EventEmitter, ViewChild, Renderer2, AfterViewInit } from '@angular/core';
import { MatSnackBar, MatDialog } from '@angular/material';
import { MatDialogConfig } from "@angular/material";

import { ActivatedRoute, Router } from '@angular/router';
import { ViewEventComponent } from '../../modals/view-event/view-event.component';

import { Moment } from 'moment';
import * as moment from 'moment';
import { MatCalendar } from '@angular/material';
import { times } from '../times';

// Components
import { AddCalendarEventComponent } from '../../modals/add-calendar-event/add-calendar-event.component'

// Service
import { CalendarService } from '../../../services/calendar.service'
import { MicrosoftService } from 'src/app/services/microsoft.service';

@Component({
    selector: 'app-calendarSuccess',
    templateUrl: './calendarSuccess.component.html',
    styleUrls: ['./calendarSuccess.component.scss']
})
export class CalendarSuccessComponent implements AfterViewInit {
    @Output()
    dateSelected: EventEmitter<Moment> = new EventEmitter();

    @Output()
    selectedDate: any = moment();

    @ViewChild('calendar', { static: true })
    calendar: MatCalendar<Moment>;

    loadingEvents = true;
    loadingPage = true;
  
    selectedWeek:any = [];
    weeklyEvents = [];

    userid: any;
    private userData: any

    constructor(
        private calendarService: CalendarService,
        private snackbar: MatSnackBar,
        private dialog: MatDialog,
        private renderer: Renderer2,
        private router: Router,
        private times: times,
        private microsoftService: MicrosoftService
    ) {
        this.times.times.forEach((timePeriod) => {
            this.eventArr.push({
                time: timePeriod,
                week: []
            })
        })
        let type = this.calendarService.getType();
        let calendarid = this.calendarService.getCalendarid();
        console.log(type);
        // if(type == 'google') {
        //   if(!calendarid) {
        //     this.calendarService.getGoogleEvents()
        //       .then((events) => {
        //           console.log(events);
        //           this.userData = events;
        //           this.eventsGot = this.userData.events;
        //           this.setWeek();
        //           this.setWeeklyView();
        //     })
        //   } else {
        //     this.calendarService.getCurveEvents()
        //       .then((events) => {
        //         console.log(events);
        //         this.userData = events;
        //         this.eventsGot = this.userData;
        //         this.setWeek();
        //         this.setWeeklyView();
        //       })
        //   }
        // } else if(type == 'curve') {
          localStorage.setItem('calendarid', localStorage.getItem('userId'));
          this.calendarService.getCurveEvents()
            .then((events) => {
              console.log(events);
              this.userData = events;
              this.eventsGot = this.userData;
              this.setWeek();
              this.setWeeklyView();
            })
        // } else if(type == 'microsoft') {
        //   this.userData = this.microsoftService.getMicrosoftEvents();
        //   this.eventsGot = this.userData;
        //   console.log(this.userData);
        //   if(!this.eventsGot) {
        //     this.router.navigate(['/calendar'])
        //   }
        //   this.setWeek();
        //   this.setWeeklyView();
        // }
    }

    eventArr:any = [];


    private eventsGot: any
    private code: any


    ngAfterViewInit() {
        this.dateSelected.subscribe(data => {
          this.loadingPage = true;
          this.setWeek();
          this.setWeeklyView();
        });

        this.userid = localStorage.getItem('userId');
      }
      


    setWeeklyView() {
        this.weeklyEvents = [[], [], [], [], [], [], []];
        for (let i = 0; i < this.eventArr.length; i++) {
            this.weeklyEvents[0].push(['']);
            this.weeklyEvents[1].push(['']);
            this.weeklyEvents[2].push(['']);
            this.weeklyEvents[3].push(['']);
            this.weeklyEvents[4].push(['']);
            this.weeklyEvents[5].push(['']);
            this.weeklyEvents[6].push(['']);
        }

        for(let i = 0; i < this.weeklyEvents.length; i++) {
          let dayHasEvent = false;
          let eventsToAdd = [];
          this.eventsGot.find((d):any => {
            if(moment(d.start.dateTime).format('MMMM Do YYYY') == this.selectedWeek[i].timestamp) {
              dayHasEvent = true;
              eventsToAdd.push(d);
            }
          })
          if(dayHasEvent) {
            eventsToAdd.forEach(event => {
              let index = this.eventArr.findIndex(time => {
                if(time.time == moment(event.start.dateTime).format('h:00 a')) {
                  return true;
                }
              });
              if(index > -1) {
                if(this.calendarService.getType() == 'microsoft' && index - 4 > -1) {
                  this.weeklyEvents[i][index - 4].push(event) 
                } else {
                  this.weeklyEvents[i][index].push(event)
                }
              }
            })
          }
        }
        this.loadingPage = false;
      }
    
      setWeek() {
        console.log('curr day of week ' + this.selectedDate);
        let currDayOfWeek = moment(this.selectedDate).day();
        let dayModifer = currDayOfWeek;
        let pastDay = false;
        let week = [];
    
        for(var i = 0; i < 7; i++) {
          if(i === currDayOfWeek) {
            pastDay = true;
            week.push({
              display: moment(this.selectedDate).format('ddd Do'),
              timestamp: moment(this.selectedDate).format('MMMM Do YYYY')
            });
            dayModifer = 1;
          } else {
            if(!pastDay) {
              week.push({
                display: moment(this.selectedDate).subtract(dayModifer, 'd').format('ddd Do'),
                timestamp: moment(this.selectedDate).subtract(dayModifer, 'd').format('MMMM Do YYYY')
              });
              dayModifer = dayModifer - 1;
            } else {
              week.push({
                display: moment(this.selectedDate).add(dayModifer, 'd').format('ddd Do'),
                timestamp: moment(this.selectedDate).add(dayModifer, 'd').format('MMMM Do YYYY')
              });
              dayModifer = dayModifer + 1;

            }
        }
      }
      this.selectedWeek = week;

      }

      viewEventDetails(event) {
        const dialogRef = this.dialog.open(ViewEventComponent, {
          maxWidth: "500px",
          data: event
        });
      }
    
      monthSelected(date: Moment) {

        console.log('month changed');
    }

    dateChanged() {
        this.calendar.activeDate = this.selectedDate;
        this.dateSelected.emit(this.selectedDate);
    }

    prevDay() {
        const prevMoment = moment(this.selectedDate).add(-1, 'days');
        this.selectedDate = prevMoment;
        this.dateChanged();
    }

    today() {
        this.selectedDate = moment();
        this.dateChanged();
    }


    nextDay() {
        const nextMoment = moment(this.selectedDate).add(1, 'days');
        this.selectedDate = nextMoment;
        this.dateChanged();
    }


    addEvent(){
        const dialogConfig = new MatDialogConfig();

        dialogConfig.autoFocus = false;
        dialogConfig.width = "100em";
        dialogConfig.data = {
            userData: this.userData
        }

        let dialogRef = this.dialog.open(AddCalendarEventComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(res => {
            if (res) {
                this.snackbar.open('Event Added', 'Close', {
                    duration: 3000,
                    panelClass: 'success-snackbar'
                })
            }
        })
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
          // this.router.navigate(['/calendarSuccess']);
        });
    }
}