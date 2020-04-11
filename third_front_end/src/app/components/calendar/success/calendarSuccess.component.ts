import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

// Service
import { CalendarService } from '../../../services/calendar.service'

@Component({
    selector: 'app-calendarSuccess',
    templateUrl: './calendarSuccess.component.html',
    styleUrls: ['./calendarSuccess.component.scss']
})
export class CalendarSuccessComponent implements OnInit {
    private events: any
    private code: any


    constructor(
        private calendarService: CalendarService,
        private snackbar: MatSnackBar,
        private route: ActivatedRoute
    ) { 
        this.route.parent.queryParams.subscribe(params => {
            this.code = params['code']
        })
    }

    

    ngOnInit() {
        this.calendarService.getGoogleEvents(this.code)
            .then((events) => {
                this.events = events;
                console.log(this.events)
            })
    }
}