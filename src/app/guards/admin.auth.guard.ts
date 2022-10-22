import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, ResolveStart, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate {
  constructor(private authService: AuthenticationService, private router: Router) { }


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const user = this.authService.userValue;
    if (user && (user.role == 'admin' || user.role == 'sadmin')) {
      return true;
    } else {
      console.log('No authorization');
      alert('You do not have access to this feature. Login with the administrator credentials')
      // this.router.navigate(['login'], { queryParams: { returnUrl: state.url } });
      return false;
    }
  }

}
