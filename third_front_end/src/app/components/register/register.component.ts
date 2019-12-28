import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  //user = {username: '', password: '', rememberMe: false};
  constructor(public http: HttpClient, public router: Router, public storage: LocalStorageService) { }

  ngOnInit() {
  }
  register(user:any) {
    // send data and store 
    // redirect to login page 
    const params = new HttpParams({fromObject: user});
    
    const reqHeader = new HttpHeaders({"content-type": "application/x-www-form-urlencoded"});
    this.http.post("/api/register", params, {headers:reqHeader, observe: "response"}).subscribe((res:any) => {
      console.log(res);
      console.log(res.body);
      this.storage.set('username', res.body.username);
      this.router.navigate(['/login']);
    },
    error => {
      console.log(error);
    })

  }

}
