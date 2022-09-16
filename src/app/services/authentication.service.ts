import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from '../models/user';



@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  public user: Observable<User>;
  public userSubject: BehaviorSubject<User> = new BehaviorSubject<User>(null as any);;

  private refreshTokenTimeout: any;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {

    // if (sessionStorage.getItem('user')){
    //   const userInfo = JSON.parse(sessionStorage.getItem('user') || '' );
    //   this.userSubject = new BehaviorSubject<User>(userInfo as User);
      
    // }
    // else{
    //   this.userSubject = new BehaviorSubject<User>(null as any);
    // }
    this.userSubject = new BehaviorSubject<User>(null as any);
    this.user = this.userSubject.asObservable();
    
  }


  public get userValue(): User {
    return this.userSubject.value;
  }

  loadToken() {
    // const token =  localStorage.getItem('token');
    // const rfToken = localStorage.getItem('token2');

    // if (token && rfToken) {
    //   console.log(token);
    //   console.log(rfToken);

    //   this.http.post<any>(`${environment.apiUrl}/refresh-token?refreshToken=${rfToken}`, {}, { withCredentials: false })
    //   .subscribe(user=>{
    //     this.userSubject.next(user);
    //       this.startRefreshTokenTimer();
    //       console.log(user);
    //   });
    //   // .pipe(map((user) => {
    //   //     this.userSubject.next(user);
    //   //     this.startRefreshTokenTimer();
    //   //     console.log(user);
    //   // }));
      
    // } else {
    //   console.log('Token not found');
    //   this.userSubject.next(null as any);
    //   this.clearSession();
    // }
  }

  login(credential: { username:string, password:string }) {
    return this.http.post<any>(`${environment.apiUrl}/login`, credential, { withCredentials: false })
      .pipe(map(user => {
        this.userSubject.next(user);

        this.startRefreshTokenTimer();
        this.setSession(user);
        return user;
      }));
  }



  async logout() {
    const refreshToken = localStorage.getItem('token2');//localStorage.getItem('token2');
    this.http.post<any>(`${environment.apiUrl}/revoke-token?refreshToken=${refreshToken}`,
      {}, { withCredentials: false }).subscribe();
    this.stopRefreshTokenTimer();
    this.userSubject.next(null as any);
    this.clearSession();
    // this.router.navigate(['/login']);
  }


  refreshToken() {
    const refreshToken = localStorage.getItem('token2');//localStorage.getItem('token2');
    console.log('REFRESH TOKEN');
    console.log(refreshToken);
    return this.http.post<any>(`${environment.apiUrl}/refresh-token?refreshToken=${refreshToken}`, {refreshToken : refreshToken})
        .pipe(map((user) => {
          console.log('GOT THE RETURN FROM THE REFERSH')
          console.log(user);
            this.setSession(user);
            this.userSubject.next(user);
            this.startRefreshTokenTimer();
            return user;
        }));
  }


  private  setSession(user:any) {
    localStorage.setItem('token', user.jwtToken);
    localStorage.setItem('token2',  user.refreshToken );
    sessionStorage.setItem('user', JSON.stringify(user));
  }

  private  clearSession() {

    localStorage.removeItem('token');
    localStorage.removeItem('token2');
    sessionStorage.removeItem('user');
  }

  // helper methods


  private startRefreshTokenTimer() {
    // parse json object from base64 encoded jwt token

    const jwtToken = JSON.parse(atob(this.userValue!.jwtToken!.split('.')[1]));

    // set a timeout to refresh the token a minute before it expires
    const expires = new Date(jwtToken.exp * 1000);
    const timeout = expires.getTime() - Date.now() - (60 * 1000);
    this.refreshTokenTimeout = setTimeout(async () => {
      const postObj =  this.refreshToken();
      postObj?.subscribe();
    }, timeout);
  }

  private stopRefreshTokenTimer() {
    clearTimeout(this.refreshTokenTimeout);
  }
}
