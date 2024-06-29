import { Routes } from '@angular/router';
import { AuthRegisterComponent } from './pages/auth/auth-register/auth-register.component';
import { HomeComponent } from './pages/home/home.component';
import AuthLoginComponent from './pages/auth/auth-login/auth-login.component';
import { ExamenesComponent } from './pages/examenes/examenes.component';
import { TemasUserComponent } from './pages/temas-user/temas-user.component';
import { QuestionsComponent } from './pages/questions/questions.component';
import { ExamsListComponent } from './pages/admin/exams-list/exams-list.component';

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

  //URL DE TEMAS
  {
    path:'temas', component: TemasUserComponent
  },

  //URL DE TEST
  {
    path:'test', component: QuestionsComponent
  },

   //URLs DE ADMIN
   {
    path:'lista', component: ExamsListComponent
  },






  //URL QUE NO EXISTE, REDIRECCIONA A LA HOME
  {
    path:'**', redirectTo: ''
  },




];
