import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { StudentProfileComponent } from './components/student-profile/student-profile.component';
import { FacultyProfileComponent } from './components/faculty-profile/faculty-profile.component';
import { RegisterComponent } from './components/register/register.component';
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
    path: 'studentProfile/:id', component: StudentProfileComponent
  },
  {
    path: 'facultyProfile/:id', component: FacultyProfileComponent
  },
  {
    path: 'register', component: RegisterComponent
  }, 
  {
    path: 'editStudentProfile', component: EditStudentComponent
  },
  {
    path: 'editFacultyProfile', component: EditFacultyComponent
  },
  {
    path: 'research', component: ResearchComponent
  },
  {
    path: 'candidate/:id', component: CandidateComponent
  },
  {
    path: '', redirectTo: 'login', pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
