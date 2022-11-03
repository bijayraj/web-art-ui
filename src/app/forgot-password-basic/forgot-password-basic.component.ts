import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-forgot-password-basic',
  templateUrl: './forgot-password-basic.component.html',
  styleUrls: ['./forgot-password-basic.component.scss']
})
export class ForgotPasswordBasicComponent implements OnInit {
  submitted = false;
  username: string = '';
  constructor(private authService: AuthenticationService) { }

  ngOnInit(): void {
  }

  submit() {
    this.submitted = true;
    this.authService.forgotPassword(this.username).subscribe(
      data => { console.log(data) }
    );
  }

}
