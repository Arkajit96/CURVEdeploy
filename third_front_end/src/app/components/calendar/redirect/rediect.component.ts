import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

// Service
import { CalendarService } from '../../../services/calendar.service'


@Component({
    selector: 'app-redirect',
    templateUrl: './redirect.component.html',
    styleUrls: ['./redirect.component.scss']
})
export class RedirectComponent implements OnInit {

    constructor(
        private calendarService: CalendarService,
        private currentRoute: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        switch (this.calendarService.getSyncState()) {
            case 'google':
                this.googleAuth();
                break;
            case 'Apple':
                this.appleAuth();
            case 'windows':
                this.windowsAuth();
        }
    }

    googleAuth() {
        this.currentRoute.queryParams.subscribe(params => {
            localStorage.setItem('googleCalendarCode', params['code']);
            this.calendarService.getGoogleEvents(params['code'])
                .then(res => {
                    if (res) {
                        this.router.navigate(['/calendarSuccess'])
                    }
                });
        })
    }

    appleAuth() {

    }

    windowsAuth() {

    }

}