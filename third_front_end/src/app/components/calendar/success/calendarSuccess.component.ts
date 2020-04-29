
import { Component, OnInit, Output, EventEmitter, ViewChild, Renderer2, AfterViewInit } from '@angular/core';
import { MatSnackBar, MatDialog } from '@angular/material';
import { MatDialogConfig } from "@angular/material";

import { ActivatedRoute } from '@angular/router';
import { ViewEventComponent } from '../../modals/view-event/view-event.component';

import { Moment } from 'moment';
import * as moment from 'moment';
import { MatCalendar } from '@angular/material';
import { times } from '../times';

import { Router } from '@angular/router';

// Components
import { AddCalendarEventComponent } from '../../modals/add-calendar-event/add-calendar-event.component'

// Service
import { CalendarService } from '../../../services/calendar.service'

@Component({
    selector: 'app-calendarSuccess',
    templateUrl: './calendarSuccess.component.html',
    styleUrls: ['./calendarSuccess.component.scss']
})
export class CalendarSuccessComponent implements OnInit, AfterViewInit {
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

    private userData: any

    constructor(
        private calendarService: CalendarService,
        private snackbar: MatSnackBar,
        private router: Router,
        private dialog: MatDialog,
        private renderer: Renderer2,
        private times: times
    ) {
    }

    eventArr:any = [];

    ngOnInit() {

      this.userData = this.calendarService.getEvents()
      .then(events => {
        this.userData = events;
        this.setWeeklyView();
      });
      
      // this.calendarService.getEvents()
      // .then((events) => {
      //     this.userData = events;
      //     this.setWeeklyView();
      // })
        // this.calendarService.getGoogleEvents(this.code)
        //     .then((events) => {
        //         this.eventsGot = events;
        //         console.log(this.eventsGot.events[0].start.dateTime);
        //         console.log(moment(this.eventsGot.events[0].start.dateTime).format('MMMM Do YYYY'));
        //         console.log(this.eventsGot)
        //         this.setWeeklyView();
        //     })
    }


    ngAfterViewInit() {
        // this.timeArr = this.times.times;
        this.times.times.forEach((timePeriod) => {
            this.eventArr.push({
                time: timePeriod,
                week: []
            })
        })

        this.dateSelected.subscribe(data => {
          // console.log(data);
          this.loadingPage = true;
          this.setWeek();
          this.setWeeklyView();
        })
        // const buttons = document.querySelectorAll('.mat-calendar-previous-button, .mat-calendar-next-button');

        setTimeout(() => {
          this.setWeek();
          // this.setWeeklyView();
        }, 0)
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
        console.log(this.selectedWeek);
        for(let i = 0; i < this.weeklyEvents.length; i++) {
          let dayHasEvent = false;
          let eventsToAdd = [];
          this.userData.events.find((d):any => {
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
              if(index) {
                this.weeklyEvents[i][index].push(event)
              }
            })
          }
        }
        this.loadingPage = false;
      }
    
      setWeek() {
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
        // console.log(event);
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
}