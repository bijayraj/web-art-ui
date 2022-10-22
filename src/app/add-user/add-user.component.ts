import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { UserService } from '../services/user.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  form!: FormGroup;
  id!: number;
  isAddMode!: boolean;
  loading = false;
  submitted = false;

  roles = ['Artist', 'Admin', 'SAdmin'];

  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private notificationSercice: NotificationService) { }

  get f() { return this.form.controls; }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id || this.id == 0;

    // password not required in edit mode
    const passwordValidators = [Validators.minLength(6)];

    if (this.isAddMode) {
      passwordValidators.push(Validators.required);
    }

    this.form = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      role: ['Artist', Validators.required],
      password: ['1234567', passwordValidators]
    });

    if (!this.isAddMode) {
      this.userService.get(this.id)
        .subscribe(x => {
          console.log(x);
          this.f['firstName'].setValue(x.firstName);
          this.f['lastName'].setValue(x.lastName);
          this.f['username'].setValue(x.username);
          this.f['role'].setValue(x.role);
        });
    }
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }
    this.loading = true;
    if (this.isAddMode) {
      this.createUser();
    } else {
      this.updateUser();
    }
  }


  private createUser() {
    this.userService.addUser(this.form.value)
      .pipe(first())
      .subscribe(
        data => {
          this.notificationSercice.success('User added successfully');
          this.router.navigate(['.', { relativeTo: this.route }]);
        },
        error => {
          this.notificationSercice.error(error);
          this.loading = false;
        });
  }

  private updateUser() {
    console.log(this.form.value);

    this.userService.edit(this.id, this.form.value)
      .pipe(first())
      .subscribe(
        data => {
          this.notificationSercice.success('Update successful');
          this.router.navigate(['..', { relativeTo: this.route }]);
        },
        error => {
          this.notificationSercice.error(error);
          this.loading = false;
        });
  }

}
