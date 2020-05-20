import { Component, OnInit,OnDestroy} from '@angular/core';
import { NgForm} from '@angular/forms';
import { Subscription } from 'rxjs';

import {AuthService} from '../../../services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub: Subscription;

  constructor(public authService: AuthService) { }

  ngOnInit() {
    localStorage.clear();
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
  }

  userLogin(form: NgForm) {

    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.login(form.value.email, form.value.password, form.value.entity);

    // this.storage.set('rememberMe', user.rememberMe);
    // this.storage.set('password', user.password);
    // const params = new HttpParams({fromObject: user});
    // console.log(user);
    // const reqHeader = new HttpHeaders({"content-type": "application/x-www-form-urlencoded"});
    // this.http.post("/api/login", params).subscribe((res:any) => {
    //   console.log(res)
    //   if (res.body) {
    //     // console.log(res.body);
    //     this.person = res.body;
    //     if (this.person.message) {
    //       alert(this.person.message);
    //       //this.router.navigate()

    //     }

    //     this.storage.set('userid', this.person._id);
    //     this.storage.set('identity', this.person.entity);
    //     console.log(this.person)
    //     if (this.person.entity == "student") {
    //       //console.log(this.person);
    //       console.log(11111);
    //       console.log(this.person._id);
    //       this.router.navigate(['/studentProfile/', this.person._id]);
    // } else if (this.person.entity == "faculty") {
    //   this.router.navigate(['/facultyProfile/', this.person._id]);
    // }
    //   } else {
    //     alert("Username or Password is wrong!")
    //   }
    // },
    // error => {console.log(error)});
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

}
