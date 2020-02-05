import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './components/auth/auth.guard';

import { LoginComponent } from './components/auth/login/login.component';
import { StudentProfileComponent } from './components/student-profile/student-profile.component';
import { FacultyProfileComponent } from './components/faculty-profile/faculty-profile.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { EditStudentComponent } from './components/edit-student/edit-student.component';
import { EditFacultyComponent } from './components/edit-faculty/edit-faculty.component';
import { SearchResultsComponent } from './components/search-results/search-results.component';
import { ResearchComponent } from './components/research/research.component';
import { CandidateComponent } from './components/candidate/candidate.component';

const routes: Routes = [
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'studentProfile/:id', component: StudentProfileComponent, canActivate: [AuthGuard]
  },
  {
    path: 'facultyProfile/:id', component: FacultyProfileComponent, canActivate: [AuthGuard]
  },
  {
    path: 'register', component: RegisterComponent
  },
  {
    path: 'editStudentProfile', component: EditStudentComponent, canActivate: [AuthGuard]
  },
  {
    path: 'editFacultyProfile', component: EditFacultyComponent, canActivate: [AuthGuard]
  },
  {
    path: 'searchResults/:query', component: SearchResultsComponent, canActivate: [AuthGuard]
  },
  {
    path: 'research', component: ResearchComponent, canActivate: [AuthGuard]
  },
  {
    path: 'candidate/:id', component: CandidateComponent, canActivate: [AuthGuard]
  },
  {
    path: '', redirectTo: 'login', pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
