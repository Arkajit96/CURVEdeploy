import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { AvatarModule } from 'ngx-avatar';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { StudentProfileComponent } from './components/student-profile/student-profile.component';
import { FacultyProfileComponent } from './components/faculty-profile/faculty-profile.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HeaderComponent } from './components/header/header.component';
import { EditStudentComponent } from './components/edit-student/edit-student.component';
import { EditFacultyComponent } from './components/edit-faculty/edit-faculty.component';
import { RequestInterceptor } from './services/request-interceptor';
import { SearchResultsComponent } from './components/search-results/search-results.component';
import { ResearchComponent } from './components/research/research.component';
import { CandidateComponent } from './components/candidate/candidate.component';
import { CanidateSearchComponent } from './components/canidate-search/canidate-search.component';
import { AddInterestsComponent } from './components/modals/add-interests/add-interests.component'

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
    CandidateComponent,
    CanidateSearchComponent,
    AddInterestsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    AvatarModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
