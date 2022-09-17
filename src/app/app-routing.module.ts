import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArtAddComponent } from './art-add/art-add.component';
import { ArtsComponent } from './arts/arts.component';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'home',
    component: HomeComponent
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
    path: '',
    component: HomeComponent
  }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
