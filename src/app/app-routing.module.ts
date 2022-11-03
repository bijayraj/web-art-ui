import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddUserComponent } from './add-user/add-user.component';
import { ApprovalsComponent } from './approvals/approvals.component';
import { ArtAddComponent } from './art-add/art-add.component';
import { ArtsComponent } from './arts/arts.component';
import { ForgotPasswordBasicComponent } from './forgot-password-basic/forgot-password-basic.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordBasicComponent
  },
  {
    path: 'reset-forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: 'arts',
    component: ArtsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'create',
    component: ArtAddComponent,
    canActivate: [AuthGuard]

  },
  {
    path: 'edit/:id',
    component: ArtAddComponent,
    canActivate: [AuthGuard]

  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'users/:id',
    component: AddUserComponent,
    canActivate: [AuthGuard],
    data: {
      role: 'SAdmin'
    }

  },
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [AuthGuard],
    data: {
      role: 'SAdmin'
    }

  },
  {
    path: 'approvals',
    component: ApprovalsComponent,
    canActivate: [AuthGuard],
    data: {
      role: 'SAdmin,Admin'
    }

  },
  {
    path: 'approvals/:id',
    component: ArtAddComponent,
    canActivate: [AuthGuard],
    data: {
      role: 'SAdmin,Admin'
    }

  },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
