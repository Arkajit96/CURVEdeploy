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
        this.currentRoute.queryParams.subscribe(params => {
            this.calendarService.getGoogleEventsAndSave(params['code'])
                .then((state) => {
                    console.log('state:' + state);

                    this.router.navigate(['/calendar'])
                });
        })
    }

    // googleAuth() {


    //     if (!this.calendarService.getState().syncState) {
    //         this.currentRoute.queryParams.subscribe(params => {
    //             // this.calendarService.(params['code']);

    //             this.calendarService.getEventsFromDatabase()
    //                 .then((events) => {
    //                     console.log(events);
    //                 });

    //             this.router.navigate(['/calendarSuccess'])
    //         })
    //     }


    // }

}