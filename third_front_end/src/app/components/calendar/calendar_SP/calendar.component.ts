import { Component, Output, EventEmitter, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { MatSnackBar, MatDialog } from '@angular/material';
import { MatDialogConfig } from "@angular/material";

//date related
import { Moment } from 'moment';
import * as moment from 'moment';
import { MatCalendar } from '@angular/material';
import { times } from '../times';

// Components
import { ViewEventComponent } from '../../modals/view-event/view-event.component';
import { AddCalendarEventComponent } from '../../modals/add-calendar-event/add-calendar-event.component'

// Service
import { CalendarService } from '../../../services/calendar.service'
import { MicrosoftService } from 'src/app/services/microsoft.service';


@Component({
    selector: 'app-calendar_SP',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
    @Output()
    dateSelected: EventEmitter<Moment> = new EventEmitter();

    @Output()
    selectedDate: any = moment();

    @ViewChild('calendar', { static: true })
    calendar: MatCalendar<Moment>;

    loadingPage = true;

    eventArr: any = [];
    selectedWeek: any = [];
    weeklyEvents = [[], [], [], [], [], [], []];


    constructor(
        private calendarService: CalendarService,
        private microsoftService: MicrosoftService,
        private snackbar: MatSnackBar,
        private dialog: MatDialog,
        private times: times
    ) {
        this.times.times.forEach((timePeriod) => {
            this.eventArr.push({
                time: timePeriod,
                week: []
            })
        })
    }

    ngOnInit() {
        this.setWeek();
        this.initWeeklyEvents();

        this.calendarService.getEventsFromDatabase()
            .then(events => {
                console.log(events);
                if (events.length > 0) {
                    this.setWeeklyView(events);
                }

                this.loadingPage = false;
            })
    }


    ngAfterViewInit() {
        this.dateSelected.subscribe(data => {
            this.loadingPage = false;
        });
    }

    initWeeklyEvents() {
        for (let i = 0; i < this.eventArr.length; i++) {
            this.weeklyEvents[0].push(['']);
            this.weeklyEvents[1].push(['']);
            this.weeklyEvents[2].push(['']);
            this.weeklyEvents[3].push(['']);
            this.weeklyEvents[4].push(['']);
            this.weeklyEvents[5].push(['']);
            this.weeklyEvents[6].push(['']);
        }
    }

    setWeeklyView(events: any) {
        for (let i = 0; i < this.weeklyEvents.length; i++) {
            let dayHasEvent = false;
            let eventsToAdd = [];
            events.find((d): any => {
                if (moment(d.start.dateTime).format('MMMM Do YYYY') == this.selectedWeek[i].timestamp) {
                    dayHasEvent = true;
                    eventsToAdd.push(d);
                }
            })
            if (dayHasEvent) {
                eventsToAdd.forEach(event => {
                    let index = this.eventArr.findIndex(time => {
                        if (time.time == moment(event.start.dateTime).format('h:00 a')) {
                            return true;
                        }
                    })
                    if (dayHasEvent) {
                        eventsToAdd.forEach(event => {
                            let index = this.eventArr.findIndex(time => {
                                if (time.time == moment(event.start.dateTime).format('h:00 a')) {
                                    return true;
                                }
                            });
                            if (index > -1) {
                                if (this.calendarService.getState().syncState == 'microsoft' && index - 4 > -1) {
                                    this.weeklyEvents[i][index - 4].push(event)
                                } else {
                                    this.weeklyEvents[i][index].push(event)
                                }
                            }
                        })
                    }
                })
            }
        }
    }


    setWeek() {
        let currDayOfWeek = moment(this.selectedDate).day();
        let dayModifer = currDayOfWeek;
        let pastDay = false;
        let week = [];

        for (var i = 0; i < 7; i++) {
            if (i === currDayOfWeek) {
                pastDay = true;
                week.push({
                    display: moment(this.selectedDate).format('ddd Do'),
                    timestamp: moment(this.selectedDate).format('MMMM Do YYYY')
                });
                dayModifer = 1;
            } else {
                if (!pastDay) {
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


    // open modal for event
    viewEventDetails(event) {
        const dialogRef = this.dialog.open(ViewEventComponent, {
            maxWidth: "500px",
            data: event
        });
    }

    addEvent() {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.autoFocus = false;
        dialogConfig.width = "100em";
        dialogConfig.data = {
            state: this.calendarService.getState()
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



    // load events from microsoft and save to the database
    async loadMicrosoftCalendar() {
        await this.microsoftService.signIn();

        this.microsoftService.getEvents()
            .then((events) => {
                this.loadingPage = true;
                this.microsoftService.saveMicrosoftEvents(events);
                this.loadingPage = false;
            });
    }

    // load events from google and save to the database
    loadGoogleCalendar(){
        this.calendarService.googleOath()
        .then(url => {
            console.log(url);
            window.location.href = url
        })
    }

}