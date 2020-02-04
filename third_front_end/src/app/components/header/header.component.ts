import { Component, OnInit, OnDestroy} from '@angular/core';
import { Subscription } from 'rxjs';


// import { LocalStorageService } from '../../services/local-storage.service';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy{
  userIsAuthenticated = false;
  userId: string;
  entity: string;
  private authListenerSubs: Subscription;
  constructor(private authService: AuthService) { }

  // ngOnInit() {

  //   this.identity = this.storage.get('identity');
  //   this.id = this.storage.get('userid');
  //   if (this.identity == 'student') {
  //     this.val = true;
  //   } else if (this.identity == 'faculty') {
  //     this.val = false;
  //   }
  // }
  ngOnInit() {
    this.entity = this.authService.getEntity();
    console.log(this.entity);
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.userId = this.authService.getUserId();
    this.entity = this.authService.getEntity();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }

}
