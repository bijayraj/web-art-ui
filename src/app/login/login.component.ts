import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
// import { AuthService } from '../auth.service';
import { filter, Subject, take, takeUntil } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  credentials!: FormGroup;
  error?: string;

  public loginValid = true;
  // public username = '';
  // public password = '';

  private _destroySub$ = new Subject<void>();
  private readonly returnUrl: string;

  constructor(
    private fb: FormBuilder,
    private _route: ActivatedRoute,
    private router: Router,
    private _authService: AuthenticationService
  ) {
    this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/home';
  }

  get f() { return this.credentials.controls; }

  get username() {
    return this.credentials.get('username');
  }

  get password() {
    return this.credentials.get('password');
  }


  public ngOnInit(): void {
    // this._authService.isAuthenticated$.pipe(
    //   filter((isAuthenticated: boolean) => isAuthenticated),
    //   takeUntil(this._destroySub$)
    // ).subscribe( _ => this._router.navigateByUrl(this.returnUrl));


    this.credentials = this.fb.group({
      username: ['admin@siu.edu', [Validators.required, Validators.email]],
      password: ['admin123', [Validators.required, Validators.minLength(6)]],
    });


  }

  public ngOnDestroy(): void {
    this._destroySub$.next();
  }

  public onSubmit(): void {
    this.loginValid = true;

    // this._authService.login(this.username, this.password).pipe(
    //   take(1)
    // ).subscribe({
    //   next: _ => {
    //     this.loginValid = true;
    //     this._router.navigateByUrl('/game');
    //   },
    //   error: _ => this.loginValid = false
    // });
  }


  async login() {

    this._authService.login(this.credentials.value).subscribe(
      async (res) => {
        console.log(res);
        this.router.navigateByUrl(this.returnUrl);
      },
      async (res) => {
        console.log('Login failed');
        this.loginValid = false;
        this.error = res.error.error;
      }
    );
  }
}