import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { LocalStorageService } from '../../services/local-storage.service';
import { Local } from 'protractor/built/driverProviders';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  user = {username: '', password: '', rememberMe: false};
  person:any;
  constructor(public http: HttpClient, public storage: LocalStorageService, public router: Router) { }

  ngOnInit() {
    this.user.username = this.storage.get('username');
    this.user.password = this.storage.get('password');
    console.log(this.user.username);
    console.log(this.user.password);
    // this.user.rememberMe = this.storage.get('rememberMe');

  }
  userLogin(user:any) {
    this.storage.set('rememberMe', user.rememberMe);
    this.storage.set('password', user.password);
    const params = new HttpParams({fromObject: user});
    console.log(user);
    const reqHeader = new HttpHeaders({"content-type": "application/x-www-form-urlencoded"});
    this.http.post("/api/login", params).subscribe((res:any) => {
      console.log(res)
      if (res.body) {
        //console.log(res.body);
        this.person = res.body.body;
        if (this.person.message) {
          alert(this.person.message);
          //this.router.navigate()

        }
        
        this.storage.set('userid', this.person._id);
        this.storage.set('identity', this.person.entity);
        console.log(this.person)
        if (this.person.entity == "student") {
          //console.log(this.person);
          console.log(11111);
          console.log(this.person._id);
          this.router.navigate(['/studentProfile/', this.person._id]);
    } else if (this.person.entity == "faculty") {
      this.router.navigate(['/facultyProfile/', this.person._id]);
    }
      } else {
        alert("Username or Password is wrong!")
      }
    },
    error => {console.log(error)});
  }
  
}
