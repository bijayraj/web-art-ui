import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {

  constructor(private authService: AuthenticationService, private router: Router) { }

  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const user = this.authService.userValue;
    if (user) {
      // logged in so return true
      return true;
    } else {
      // not logged in so redirect to login page with the return url
      console.log('Caught here');
      this.router.navigate(['login']);
      return false;
    }
    // return this.authService.user.pipe(
    //   filter(val => val !== null),
    //   take(1),
    //   map(user => {
    //     console.log(user);
    //     if (user) {
    //       return true;
    //     } else {
    //       this.router.navigateByUrl('/login');
    //       return false;
    //     }
    //   })
    // );

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    const user = this.authService.userValue;
    if (user) {
      // logged in so return true

      if (route.data['role'] && route.data['role'].indexOf(user.role) === -1) {
        console.log('No authorization');
        alert('You do not have access to this feature. Login with the administrator credentials');
        return false;
      }

      return true;
    } else {
      // not logged in so redirect to login page with the return url
      console.log('Caught here');
      this.router.navigate(['login'], { queryParams: { returnUrl: state.url } });
      return false;
    }
  }
}
