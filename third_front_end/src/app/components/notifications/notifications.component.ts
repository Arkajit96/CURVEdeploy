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
  unreadMessages = [];

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
    // console.log(this.user);


    this.loadInbox();

    this._msgSub = this.chatService.getMessages(this.user.user_id).subscribe(
      message => {
        let id = message.senderId == this.user.user_id ? message.recipientId : message.senderId;
        if(this.inbox.length !== 0 && this.inbox[this.selectedMessage].id == id) {
          console.log(this.selectedMessage);
          this.inbox[this.selectedMessage].time = new Date().getTime();
          this.messages.push(message);
          this.sortInbox(id, false);
          this.chatService.readMessage(this.user.user_id, id);
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
          console.log(this.inbox);
          this.sortInbox(this.inbox[this.selectedMessage].id, true);

          this.chatService.loadUnreadMessages(this.user.user_id)
            .then((messages) => {
              this.unreadMessages = messages;
              this.inbox.forEach((convo) => {
                convo.class = "chat_list";
              })
              this.inbox[this.selectedMessage].class = "chat_list active_chat";
              // this.inbox[0].time = new Date().getTime();
              this.chatService.readMessage(this.user.user_id, this.inbox[0].id);

              for(let i = 1; i < this.inbox.length; i++) {
                this.inbox[i].class = this.unreadMessages.includes(this.inbox[i].id) ? "chat_list unread_msg" : "chat_list";
              }
              
              this.loadMessage(this.inbox[this.selectedMessage]);
            })
            .catch((e) => {
              console.log(e);
            })
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
    if(this.unreadMessages.includes(this.inbox[i].id)) {
      this.chatService.readMessage(this.user.user_id, this.inbox[i].id);
    }
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
    console.log('HERE');
    for(var i = 0; i < this.inbox.length; i++) {
      if(this.inbox[i].id == user.id) {
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
        this.inbox[i].class = 'chat_list unread_msg'
        this.inbox[i].time = new Date().getTime();
        this.sortInbox(this.inbox[this.selectedMessage].id, false)
        return;
      }
    }

    // this.selectedMessage = this.inbox.length;
    this.loadInbox();
  }

  sortInbox(id, init) {
    // this.inbox = this.inbox.sort()
    this.inbox = this.inbox.sort((a, b) => {
      if(a.time > b.time) {
        return -1;
      }
      if(a.time < b.time) {
        return 1;
      }
      return 0;
    })
    console.log(this.inbox);
    if(init) {
      this.selectedMessage = 0;
      return;
    }
    for(let i = 0; i < this.inbox.length; i++) {
      if(this.inbox[i].id == id) {
        this.selectedMessage = i;
      }
    }
  }

  search(value) {
    this.chatService.searchFaculty(value)
      .then((data) => {
        this.searchResults = data;
      })
      .catch((e) => {
        console.log(e);
      })
    // this.searchResults = this.inbox.filter((user) => {
    //   if(user.name.includes(value) || user.email.includes(value))
    //     return user;
    // })
  }

  ngOnDestroy() {
    this._msgSub.unsubscribe();
    this.filteredOptions.unsubscribe();
  }

}
