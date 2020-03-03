import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { StudentService } from 'src/app/services/student.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit, AfterViewChecked {

  loadingPage = true;
  student: any;
  user: any;
  student_id: any;
  inbox = [];
  test = [];
  @ViewChild('msgDiv', {static: false})
  el: ElementRef;

  constructor(
    private router: Router,
    public route:ActivatedRoute,
    private chatService: ChatService,
    private studentService: StudentService,
    private renderer: Renderer2,
    private authService: AuthService
  ) { }

  testIndex(i) {
    console.log(i);
  }

  ngOnInit() {
    if(this.authService.getEntity() == 'student') {
      this.user = JSON.parse(localStorage.getItem('student'));
    } else {
      this.user = JSON.parse(localStorage.getItem('faculty'));
    }

    console.log(this.user);

    if(!localStorage.getItem('student')){
      this.route.params.subscribe((data) => {
        this.student_id = data.id;
        this.studentService.getStudentByUserId(this.student_id)
        .then((res) => {
          console.log(res);
          this.student = res.student;
          // this.loadingPage = false;
          this.loadInbox();
        })
        .catch((e) => {
          console.log(e);
        })
      })
    } else {
      this.student = JSON.parse(localStorage.getItem('student'));
      console.log(this.student);
      this.loadInbox();
    }
    for(let i = 0; i < 100; i++) {
      this.test.push(i);
    }
  }

  ngAfterViewChecked() {
    this.scrollToBottomMessages()
  }

  scrollToBottomMessages() {
    if(this.el) {
      this.renderer.setProperty(this.el.nativeElement, 'scrollTop', this.el.nativeElement.scrollHeight) 
    }
  }

  loadInbox() {
    this.chatService.loadInbox(this.user.user_id)
        .then((inbox) => {
          this.inbox = inbox;
          console.log(this.inbox);
          this.loadingPage = false;
        })
        .catch((e) => {
          console.log(e);
        })
  }

}
