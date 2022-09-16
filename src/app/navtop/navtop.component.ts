import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { User } from '../models/user';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-navtop',
  templateUrl: './navtop.component.html',
  styleUrls: ['./navtop.component.scss']
})
export class NavtopComponent implements OnInit {

  @Output() public sidenavToggle = new EventEmitter();
  user?:User;
  constructor(private authenticationService:AuthenticationService) { }

  ngOnInit(): void {
    this.authenticationService.userSubject.subscribe((data)=>{
      this.user = data;
    });
  }

  public onToggleSidenav = () => { 
    this.sidenavToggle.emit();

  }

  async logout(){
    const logout_result = await this.authenticationService.logout();
    console.log('Logged out');

  }
}
