import { Component, OnInit } from '@angular/core';

import {AuthService} from './services/auth.service';
import { CalendarService } from './services/calendar.service';
import { ChatService } from './services/chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  constructor(
    private authService: AuthService,
    private calendarService: CalendarService,
    private chatService: ChatService
  ) {}


  ngOnInit() {
    this.authService.autoAuthUser();
    this.calendarService.autoCalendarLogin();
  }
}
