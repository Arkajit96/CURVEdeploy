import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { AvatarModule } from 'ngx-avatar';
import { AngularMaterialModule } from './app-material.module';
import {FlashMessagesModule} from 'angular2-flash-messages';
import { AuthInterceptor } from './components/auth/auth-interceptor';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { StudentProfileComponent } from './components/student-profile/student-profile.component';
import { FacultyProfileComponent } from './components/faculty-profile/faculty-profile.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HeaderComponent } from './components/header/header.component';
import { EditStudentComponent } from './components/edit-student/edit-student.component';
import { EditFacultyComponent } from './components/edit-faculty/edit-faculty.component';
// import { RequestInterceptor } from './services/request-interceptor';
import { SearchResultsComponent } from './components/search-results/search-results.component';
import { ResearchComponent } from './components/research/research.component';
import {ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CandidateComponent } from './components/candidate/candidate.component';
import { CanidateSearchComponent } from './components/canidate-search/canidate-search.component';
import { AddInterestsComponent } from './components/modals/add-interests/add-interests.component'
import { submitApplicationComponent } from './components/modals/submit-application/submit-application.component'
import { submitAllApplicationComponent } from './components/modals/submit-all-application/submit-all-application.component'
import { InterestList } from './services/interest-list';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {TextFieldModule} from '@angular/cdk/text-field';
import { CloseConfirmComponent } from './components/modals/close-confirm/close-confirm.component';
import { EditStudentProfileComponent } from './components/modals/edit-student-profile/edit-student-profile.component';
import { ViewStudentProfileComponent } from './components/modals/view-student-profile/view-student-profile.component';
import { ChatService } from './services/chat.service';
import { ConfigService } from './services/config.service';

// SOCKET
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { EditFactulyProfileComponent } from './components/modals/edit-factuly-profile/edit-factuly-profile.component';

const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    StudentProfileComponent,
    FacultyProfileComponent,
    HeaderComponent,
    EditStudentComponent,
    EditFacultyComponent,
    SearchResultsComponent,
    ResearchComponent,
    ShoppingCartComponent,
    CandidateComponent,
    CanidateSearchComponent,
    AddInterestsComponent,
    CloseConfirmComponent,
    EditStudentProfileComponent,
    ViewStudentProfileComponent,
    submitApplicationComponent,
    NotificationsComponent,
    EditFactulyProfileComponent
    submitAllApplicationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    AvatarModule,
    AngularMaterialModule,
    FlashMessagesModule.forRoot(),
    BrowserAnimationsModule,
    TextFieldModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    InterestList,
    ChatService,
    ConfigService
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    AddInterestsComponent,
    CloseConfirmComponent,
    EditStudentProfileComponent,
    ViewStudentProfileComponent,
    submitApplicationComponent,
    EditFactulyProfileComponent
    submitAllApplicationComponent
  ]
})
export class AppModule { }
