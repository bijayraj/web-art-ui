import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArtAddComponent } from './art-add/art-add.component';
import { ArtsComponent } from './arts/arts.component';
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
    component: ArtsComponent
  },
  {
    path: 'create',
    component: ArtAddComponent
  },
  {
    path: 'edit/:id',
    component: ArtAddComponent
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
