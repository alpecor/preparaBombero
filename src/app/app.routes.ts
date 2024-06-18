import { Routes } from '@angular/router';
import { AuthRegisterComponent } from './pages/auth/auth-register/auth-register.component';
import { HomeComponent } from './pages/home/home.component';
import AuthLoginComponent from './pages/auth/auth-login/auth-login.component';

export const routes: Routes = [
  {
    path:'', component: HomeComponent
  },
  {
    path:'login', component: AuthLoginComponent
  },
  {
    path:'register', component: AuthRegisterComponent
  }
];
