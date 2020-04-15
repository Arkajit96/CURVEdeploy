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
        if (!this.calendarService.getCurrentUserCode()) {
            this.currentRoute.queryParams.subscribe(params => {
                this.calendarService.setCurrentUserCode(params['code'])
                this.router.navigate(['/calendarSuccess'])
            })
        }
    }

}