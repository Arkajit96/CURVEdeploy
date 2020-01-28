import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm} from '@angular/forms';
import { Subscription } from 'rxjs';

import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  // user = {username: '', password: '', rememberMe: false};
  isLoading = false;
  private authStatusSub: Subscription;
  constructor(public authService: AuthService) { }

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
  }

  register(form: NgForm) {
    // send data and store;
    // redirect to login page
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.createUser(form.value.email, form.value.password, form.value.entity);

    // const params = new HttpParams({fromObject: user});
    // const reqHeader = new HttpHeaders({"content-type": "application/x-www-form-urlencoded"});
    // this.http.post("/api/register", params, {headers:reqHeader, observe: "response"}).subscribe((res:any) => {
    //   console.log(res);
    //   console.log(res.body);
    //   this.storage.set('username', res.body.username);
    //   this.router.navigate(['/login']);
    // },
    // error => {
    //   console.log(error);
    // })

  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

}
