import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

// Service
// import { CalendarService } from '../../../services/calendar.service'


@Component({
    selector: 'app-redirect',
    templateUrl: './redirect.component.html',
    styleUrls: ['./redirect.component.scss']
})
export class RedirectComponent implements OnInit {

    constructor(
        // private calendarService: CalendarService,
        private currentRoute: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        // const state = this.calendarService.getState()
        // console.log(state)
        // switch (state.syncState) {
        //     case 'google':
        //         this.googleAuth();
        //         break;
        //     case 'Apple':
        //         this.appleAuth();
        //     case 'windows':
        //         this.windowsAuth();
        // }

        this.googleAuth()
    }

    googleAuth() {
        this.currentRoute.queryParams.subscribe(params => {
            localStorage.setItem('googleCalendarCode', params['code']);
            this.router.navigate(['/calendarSuccess'])
        //     this.calendarService.getGoogleEventsAndSave(params['code'])
        //         .then(res => {
        //             if (res) {
        //                 this.router.navigate(['/calendarSuccess'])
        //             }
        //         });
        })
    }

    appleAuth() {

    }

    windowsAuth() {

    }

}