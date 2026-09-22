import { Routes } from '@angular/router';
import AuthLoginComponent from './pages/auth/auth-login/auth-login.component';
import { ExamenesComponent } from './pages/examenes/examenes.component';
import { ExamenesCardsComponent } from './pages/examenes-cards/examenes-cards.component';
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
import { AuthRegisterComponent } from './pages/auth/auth-register/auth-register.component';
import { RecoveryPasswordComponent } from './pages/auth/recovery-password/recovery-password.component';
import { ResetPasswordComponent } from './pages/auth/reset-password/reset-password.component';
import { SavedQuestionsComponent } from './pages/saved-questions/saved-questions.component';
import { ReviewResultComponent } from './pages/review-result/review-result.component';
import { LandingComponent } from './pages/landing/landing.component';
import { StudyPlanComponent } from './pages/study-plan/study-plan.component';

import { SiteLayoutComponent } from './components/site-layout/site-layout.component';

export const routes: Routes = [
  {
    path: 'login', component: AuthLoginComponent, canActivate: [noAuthGuard]

  },
  {
    path: 'register', component: AuthRegisterComponent, canActivate: [noAuthGuard]
  },
  {
    path: 'recovery-password/:token', component: RecoveryPasswordComponent, canActivate: [noAuthGuard]
  },
  {
    path: 'reset-password', component: ResetPasswordComponent, canActivate: [noAuthGuard]
  },
  {
    path: 'landing', component: LandingComponent
  },
  {
    path: '',
    component: SiteLayoutComponent,
    title: 'Prepara Bombero',
    children: [
      {
        path: 'refuerzos',
        loadComponent: () => import('./pages/reinforcements/reinforcements.component').then(m => m.ReinforcementsComponent),
        title: 'Refuerzos | Prepara Bombero'
      },
      {
        path: 'informacion',
        loadComponent: () => import('./pages/information/information.component').then(m => m.InformationComponent),
        title: 'Información | Prepara Bombero'
      },
      {
        path: '', component: HomeComponent
      },
      {
        path: 'terminos-y-condiciones', component: TermsConditionsComponent
      },
      {
        path: 'politica-de-privacidad', component: PrivacyPolicyComponent
      },
      {
        path: 'listado-de-examenes', component: ExamenesComponent
      },
      {
        path: 'examenes', component: ExamenesCardsComponent
      },
      {
        path: 'examenes/:community', component: ExamenesCardsComponent
      },
      {
        path: 'examenes/:community/:city', component: ExamenesCardsComponent
      },
      {
        data: { showFooter: false }, path: 'examen/:slug-examen-bombero', component: QuestionsComponent
      },
      {
        data: { showFooter: false }, path: 'test', component: QuestionsComponent
      },
      {
        data: { showFooter: false }, path: 'review-test', component: ReviewTestComponent, canActivate: [userAuthGuard]
      },
      {
        data: { showFooter: false }, path: 'check-review', component: ReviewResultComponent
      },
      {
        path: 'check-exam', component: CheckExamComponent
      },
      {
        path: 'profile', component: ProfileComponent, canActivate: [userAuthGuard]
      },
      {
        path: 'preguntas-guardadas', component: SavedQuestionsComponent, canActivate: [userAuthGuard]
      },
      {
        path: 'plan-estudio', component: StudyPlanComponent, canActivate: [userAuthGuard]
      },
      {
        path: 'admin/examenes', component: ExamsListComponent, canActivate: [adminAuthGuard]
      },
      {
        path: 'admin/reportes', component: ReportQuestionsListComponent, canActivate: [adminAuthGuard]
      },
      {
        path: 'admin/temario', component: TopicsListComponent, canActivate: [adminAuthGuard]
      },
      {
        path: 'admin/temario/:topicId', component: QuestionCreateComponent, canActivate: [adminAuthGuard] // TODO cambiar el 10
      },
      {
        path: '**', redirectTo: ''
      }
    ]
  }
];
