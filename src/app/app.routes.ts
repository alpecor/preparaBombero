import { Routes } from '@angular/router';
import { AuthRegisterComponent } from './pages/auth/auth-register/auth-register.component';
import { HomeComponent } from './pages/home/home.component';
import AuthLoginComponent from './pages/auth/auth-login/auth-login.component';
import { ExamenesComponent } from './pages/examenes/examenes.component';
import { TemasUserComponent } from './pages/temas-user/temas-user.component';

export const routes: Routes = [
  //URL DE LA HOME
  {
    path:'', component: HomeComponent
  },

  //URLs DEL LOGIN
  {
    path:'login', component: AuthLoginComponent
  },
  {
    path:'register', component: AuthRegisterComponent
  },

  //URL DE EXAMENES
  {
    path:'examenes', component: ExamenesComponent
  },

  //URL DE TEMAS USER
  {
    path:'temas', component: TemasUserComponent
  },
];
