import { Component, OnInit, AfterViewChecked, OnDestroy, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { StudentService } from 'src/app/services/student.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FacultyService } from 'src/app/services/faculty.service';
import { Subscription, Observable } from 'rxjs';
import { FormBuilder, FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit, AfterViewChecked, OnDestroy {

  isloadingPage = true;
  user: any;
  otherUser: any;
  student_id: any;
  selectedMessage = 0;
  inbox = [];
  test = [];
  messages = [];
  newMessage = "";
  searchQuery = "";
  @ViewChild('msgDiv', {static: false})
  el: ElementRef;

  searchResults = [];
  // filteredOptions: Observable<any>;
  filteredOptions: Subscription;

  searchControl = new FormControl();

  private _msgSub: Subscription;


  constructor(
    private router: Router,
    public route:ActivatedRoute,
    private chatService: ChatService,
    private studentService: StudentService,
    private facultyService: FacultyService,
    private renderer: Renderer2,
    private authService: AuthService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {

    if(this.authService.getEntity() == 'student') {
      this.user = this.studentService.getCurrentStudentUser();
      this.user.caption = 'Class of ' + this.user.graduation_class
    } else {
      this.user = this.facultyService.getCurrentFacultyUser();
      this.user.caption = this.user.department;
    }

    this.loadInbox();

    this._msgSub = this.chatService.getMessages(this.user.user_id).subscribe(
      message => {
        let id = message.senderId == this.user.user_id ? message.recipientId : message.senderId;
        if(this.inbox.length !== 0 && this.inbox[this.selectedMessage].id == id) {
          this.messages.push(message);
        } else {
          this.findInbox(id, message);
        }
      }
    )

    this.filteredOptions = this.searchControl.valueChanges.subscribe(
      value => {
        this.search(value);
      }
    )
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
          this.inbox.forEach((convo) => {
            convo.class = "chat_list";
          })
          this.inbox[this.selectedMessage].class = "chat_list active_chat";
          this.loadMessage(this.inbox[this.selectedMessage]);
        })
        .catch((e) => {
          console.log(e);
          this.isloadingPage = false;
        })
  }

  loadMessage(otherUser) {
    this.messages = [];
    this.otherUser = otherUser;
    this.chatService.loadMessages(this.user.user_id, otherUser.id)
      .then((res) => {
        this.messages = res;
        this.isloadingPage = false;
      })
      .catch((e) => {
        this.isloadingPage = false;
      })
  }

  changeInbox(i) {
    this.inbox[this.selectedMessage].class = "chat_list";
    this.inbox[i].class = "chat_list active_chat";
    this.selectedMessage = i;
    this.loadMessage(this.inbox[i]);
  }

  sendMessage() {
    this.chatService.sendMessage(this.user.user_id, this.otherUser.id, this.newMessage)
      .then((res) => {
        this.newMessage = '';
      })
      .catch((e) => {
        console.log(e);
      })
  }
  startNewMessage(user) {
    for(var i = 0; i < this.inbox.length; i++) {
      if(this.inbox[i].id == user.user_id) {
        this.changeInbox(i);
        return;
      }
    }
    this.inbox.push({
      id: user.user_id,
      name: user.first_name + ' ' + user.last_name,
      email: user.email,
      class: 'chat_list'
    });
    this.changeInbox(this.inbox.length - 1);
  }

  findInbox(id, messsage) {
    for(var i = 0; i < this.inbox.length; i++) {
      if(this.inbox[i].id == id) {
        return;
      }
    }
    
    this.selectedMessage = this.inbox.length;
    this.loadInbox();
  }

  search(value) {
    this.chatService.searchFaculty(value)
      .then((data) => {
        this.searchResults = data;
      })
      .catch((e) => {
        console.log(e);
      })
  }

  ngOnDestroy() {
    this._msgSub.unsubscribe();
    this.filteredOptions.unsubscribe();
  }

}
