import { Routes } from '@angular/router';
import { AuthRegisterComponent } from './pages/auth/auth-register/auth-register.component';
import { HomeComponent } from './pages/home/home.component';
import AuthLoginComponent from './pages/auth/auth-login/auth-login.component';
import { ExamenesComponent } from './pages/examenes/examenes.component';
import { TopicsComponent } from './pages/topics/topics.component';
import { QuestionsComponent } from './pages/questions/questions.component';
import { ExamsListComponent } from './pages/admin/exams-list/exams-list.component';
import { QuestionCreateComponent } from './pages/admin/question-create/question-create.component';
import { ReportQuestionsListComponent } from './pages/admin/report-questions-list/report-questions-list.component';
import { TopicsListComponent } from './pages/admin/topics-list/topics-list.component';
import { noAuthGuard } from './guards/noAuth.guard';
import { adminAuthGuard } from './guards/admin-auth.guard';
import { userAuthGuard } from './guards/user-auth.guard';

export const routes: Routes = [
  //URL DE LA HOME
  {
    path:'', component: HomeComponent, canActivate:[noAuthGuard]
  },

  //URLs DEL LOGIN
  {
    path:'login', component: AuthLoginComponent, canActivate:[noAuthGuard]

  },
  {
    path:'register', component: AuthRegisterComponent, canActivate:[noAuthGuard]
  },

  //URL DE EXAMENES
  {
    path:'listado-de-examenes', component: ExamenesComponent
  },

  //URL DE Home
  {
    path:'home', component: TopicsComponent, canActivate:[userAuthGuard]
  },

  //URL DE TEST
  {
    path:'test', component: QuestionsComponent, canActivate:[userAuthGuard]
  },

   //URLs DE ADMIN
   {
    path:'admin/examenes', component: ExamsListComponent, canActivate:[adminAuthGuard]
  },

  {
    path:'admin/temario/{id}', component: QuestionCreateComponent, canActivate:[adminAuthGuard]
  },

  {
    path:'admin/reportes', component: ReportQuestionsListComponent, canActivate:[adminAuthGuard]
  },

  {
    path:'admin/temario', component: TopicsListComponent, canActivate:[adminAuthGuard]
  },






  //URL QUE NO EXISTE, REDIRECCIONA A LA HOME
  {
    path:'**', redirectTo: ''
  },




];
