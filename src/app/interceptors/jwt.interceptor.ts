import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add auth header with jwt if user is logged in and request is to the api url
        const user = this.authenticationService.userValue;
        // const isLoggedIn = user && user.jwtToken;

        const jwtToken = localStorage.getItem('token');

        const isApiUrl = request.url.startsWith(environment.apiUrl);
        // console.log(isApiUrl)
        // console.log(user)
        // // console.log(user.jwtToken);
        // console.log(jwtToken);

        if (jwtToken && isApiUrl) {
            // console.log('Intersepted request. Token is');
            // console.log(user.jwtToken);

            request = request.clone({
                setHeaders: { Authorization: `Bearer ${jwtToken}` }
            });
        }

        return next.handle(request);
    }
}