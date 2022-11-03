import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, Subject, take, takeUntil } from 'rxjs';
import Validation from '../helpers/validation';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  credentials!: FormGroup;
  error?: string;

  public loginValid = true;
  private readonly resetToken: string;

  constructor(
    private fb: FormBuilder,
    private _route: ActivatedRoute,
    private router: Router,
    private _authService: AuthenticationService
  ) {
    this.resetToken = this._route.snapshot.queryParams['token'] || '';
  }
  get f() { return this.credentials.controls; }

  public ngOnInit(): void {
    this.credentials = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      rePassword: ['', [Validators.required, Validators.minLength(6)]],
    },
      {
        validators: [Validation.match('password', 'rePassword')]
      });
  }

  public submit() {

    this._authService.changeForgottenPassword(this.credentials.value, this.resetToken);
  }

}
