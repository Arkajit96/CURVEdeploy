import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { StudentProfileComponent } from './components/student-profile/student-profile.component';
import { FacultyProfileComponent } from './components/faculty-profile/faculty-profile.component';
import { RegisterComponent } from './components/register/register.component';

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
    path: '', redirectTo: 'login', pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
