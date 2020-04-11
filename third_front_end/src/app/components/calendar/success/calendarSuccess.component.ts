import { Component, OnInit, Output, EventEmitter, ViewChild, Renderer2, AfterViewInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

import { Moment } from 'moment';
import * as moment from 'moment';
import { MatCalendar } from '@angular/material';
import { times } from '../times';

// Service
import { CalendarService } from '../../../services/calendar.service'

@Component({
    selector: 'app-calendarSuccess',
    templateUrl: './calendarSuccess.component.html',
    styleUrls: ['./calendarSuccess.component.scss']
})
export class CalendarSuccessComponent implements OnInit,AfterViewInit {
    @Output()
    dateSelected: EventEmitter<Moment> = new EventEmitter();
  
    @Output()
    selectedDate: any = moment();
  
    @ViewChild('calendar', { static: true })
    calendar: MatCalendar<Moment>;
  
    loadingEvents = true;
  
    selectedWeek = [];
    weeklyEvents = [];

    constructor(
        private calendarService: CalendarService,
        private snackbar: MatSnackBar,
        private route: ActivatedRoute,
        private renderer: Renderer2,
        private times: times
    ) { 
        this.route.queryParams.subscribe(params => {
            this.code = params['code']
        })
    }
  
    events = [
      {
        date: "April 7th",
        starttime: "3:00 pm",
        endtime: "4:00 pm",
        text: "Machine Learning"
      },
      {
        date: "April 10th",
        starttime: "2:00 pm",
        endtime: "3:00 pm",
        text: "CURVE Meeting"
      },
      {
        date: "April 10th",
        starttime: "2:00 pm",
        endtime: "3:00 pm",
        text: "Review notes"
      },
      {
        date: "April 5th",
        starttime: "4:00 pm",
        endtime: "6:00 pm",
        text: "Take a nap"
      },
      {
        date: "April 5th",
        starttime: "10:00 am",
        endtime: "11:00 am",
        text: "Homework"
      },
      {
        date: "April 16th",
        starttime: "2:00 pm",
        endtime: "3:00 pm",
        text: "Another event"
      }
    ]
  
    textEvents = [
      {
        date: "April 1, 2020",
        text: "3:00 - 4:00 CURVE Meeting"
      }
    ]
    eventArr:any = [];


    private eventsGot: any
    private code: any
    

    ngOnInit() {
        this.calendarService.getGoogleEvents(this.code)
            .then((events) => {
                this.eventsGot = events;
                console.log(this.eventsGot)
            })
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
          this.setWeek();
          this.setWeeklyView();
        })
        const buttons = document.querySelectorAll('.mat-calendar-previous-button, .mat-calendar-next-button');
    
        if (buttons) {
          Array.from(buttons).forEach(button => {
            this.renderer.listen(button, 'click', () => {
              console.log('Arrow buttons clicked');
              this.highlightEvents();
              this.setTextEvents();
            });
          });
        }
        this.setWeek();
        this.setWeeklyView();
      }


      setWeeklyView() {
        this.weeklyEvents = [[], [], [], [], [], [], []];
        for(let i = 0; i < this.eventArr.length; i++) {
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
          // this.events.find(d => {
          //   if(d.date == this.selectedWeek[i].timestamp) {
          //     dayHasEvent = true;
          //     eventsToAdd.push(d);
          //   }
          // })
          this.events.find((d):any => {
            if(d.date == this.selectedWeek[i].timestamp) {
              dayHasEvent = true;
              eventsToAdd.push(d);
            }
          })
          if(dayHasEvent) {
            eventsToAdd.forEach(event => {
              // let index = -1;
              let index = this.eventArr.findIndex(time => {
                if(time.time == event.starttime) {
                  return true;
                }
              });
              // this.weeklyEvents[i][index] = this.weeklyEvents[i][index] + '\n - ' + event.text;
              this.weeklyEvents[i][index].push(event.text)
            })
            let index = -1;
          }
        }
      }
    
      highlightEvents() {
        this.loadingEvents = true;
        let dayElements = document.querySelectorAll('.mat-calendar-table .mat-calendar-body-cell');
        Array.from(dayElements).forEach(element => {
          const dayHasEvent = this.events.find(d => 
            d.date === element.getAttribute("aria-label") 
          )
          if(dayHasEvent) {  
            this.renderer.addClass(element, "event-day");
            // this.renderer.addClass(element, "tooltip")
            this.renderer.setAttribute(element, "title", dayHasEvent.text + "\n" + "5:00 - 6:00 Another Meeting");
          } 
          // else {
          //   this.renderer.removeClass(element, "event-day");
          //   this.renderer.removeAttribute(element, "title");
          // }
        })
        this.loadingEvents = false;
      }
    
      setTextEvents() {
        this.loadingEvents = true;
        let dayElements = document.querySelectorAll('.mat-calendar-table .mat-calendar-body-cell');
        Array.from(dayElements).forEach(element => {
          const dayHasEvent = this.textEvents.find(d => 
            d.date === element.getAttribute("aria-label") 
          )
          if(dayHasEvent) {
            // console.log(dayHasEvent);
            const span = this.renderer.createElement('span');
            const tooltipText = this.renderer.createText(dayHasEvent.text);
            this.renderer.appendChild(span, tooltipText);
            this.renderer.appendChild(element, span);
            this.renderer.addClass(span, "tooltiptext");
            // this.renderer.addClass(element, "tooltip")
            
            this.renderer.addClass(element, "event-day");
            // this.renderer.setAttribute(element, "title", dayHasEvent.text);
            let text = element.children[0].innerHTML + "<br>" + dayHasEvent.text;
            this.renderer.setProperty(element.children[0], "innerHTML", text);
          } 
          // else {
          //   this.renderer.removeClass(element, "event-day");
          //   this.renderer.removeAttribute(element, "title");
          // }
        })
        this.loadingEvents = false;
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
              timestamp: moment(this.selectedDate).format('MMMM Do')
            });
            dayModifer = 1;
          } else {
            if(!pastDay) {
              week.push({
                display: moment(this.selectedDate).subtract(dayModifer, 'd').format('ddd Do'),
                timestamp: moment(this.selectedDate).subtract(dayModifer, 'd').format('MMMM Do')
              });
              dayModifer = dayModifer - 1;
            } else {
              week.push({
                display: moment(this.selectedDate).add(dayModifer, 'd').format('ddd Do'),
                timestamp: moment(this.selectedDate).add(dayModifer, 'd').format('MMMM Do')
              });
              dayModifer = dayModifer + 1;
            }
          }
        }
        this.selectedWeek = week;
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
}