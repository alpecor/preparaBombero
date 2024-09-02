import { Routes } from '@angular/router';
import { AuthRegisterComponent } from './pages/auth/auth-register/auth-register.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import AuthLoginComponent from './pages/auth/auth-login/auth-login.component';
import { ExamenesComponent } from './pages/examenes/examenes.component';
import { HomeComponent } from './pages/home/home.component';
import { QuestionsComponent } from './pages/questions/questions.component';
import { ExamsListComponent } from './pages/admin/exams-list/exams-list.component';
import { QuestionCreateComponent } from './pages/admin/question-create/question-create.component';
import { ReportQuestionsListComponent } from './pages/admin/report-questions-list/report-questions-list.component';
import { TopicsListComponent } from './pages/admin/topics-list/topics-list.component';
import { noAuthGuard } from './guards/noAuth.guard';
import { adminAuthGuard } from './guards/admin-auth.guard';
import { userAuthGuard } from './guards/user-auth.guard';
import { TermsConditionsComponent } from './components/welcome/terms-conditions/terms-conditions.component';
import { PrivacyPolicyComponent } from './components/welcome/privacy-policy/privacy-policy.component';
import { CheckExamComponent } from './pages/check-exam/check-exam.component';
import { ReviewTestComponent } from './pages/review-test/review-test.component';
import { ProfileComponent } from './pages/profile/profile.component';

export const routes: Routes = [
  //URLs DE LA HOME
  {
    path:'', component: WelcomeComponent, canActivate:[noAuthGuard]
  },
  {
    path:'terminos-y-condiciones', component: TermsConditionsComponent
  },
  {
    path:'politica-de-privacidad', component: PrivacyPolicyComponent
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
    path:'home', component: HomeComponent, canActivate:[userAuthGuard]
  },

  //URL DE EXAMEN
  {
    path:'test', component: QuestionsComponent, canActivate:[userAuthGuard]
  },

  //URL DE REPASO
  {
    path:'review-test', component: ReviewTestComponent, canActivate:[userAuthGuard]
  },

  //URL DE EXAMEN CORREGIDO
  {
    path:'check-exam', component: CheckExamComponent, canActivate:[userAuthGuard]
  },

  //URL DE PERFIL
  {
    path:'profile', component: ProfileComponent, canActivate:[userAuthGuard]
  },







   //URLs DE ADMIN
  {
    path:'admin/examenes', component: ExamsListComponent, canActivate:[adminAuthGuard]
  },
  {
    path:'admin/reportes', component: ReportQuestionsListComponent, canActivate:[adminAuthGuard]
  },

  {
    path:'admin/temario', component: TopicsListComponent, canActivate:[adminAuthGuard]
  },
  {
    path:'admin/temario/:topicId', component: QuestionCreateComponent, canActivate:[adminAuthGuard] // TODO cambiar el 10
  },




  //URL QUE NO EXISTE, REDIRECCIONA A LA HOME
  {
    path:'**', redirectTo: ''
  },
];
