import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material';

import { AuthService } from '../../services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService, 
    private router: Router,
    private snackbar: MatSnackBar) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    return new Promise((res, rej) => {
      this.authService.getIsAuth()
        .then(isAuth => {
          if (!isAuth) {
            this.router.navigate(['/login']);
            this.snackbar.open("You are not authorized, please log in! ", 'Close', {
              duration: 3000,
              panelClass: 'error-snackbar'
            })
          }
          res(isAuth);
        });
    })
  }
}
