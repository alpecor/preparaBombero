import { NgOptimizedImage } from '@angular/common';
import { Component, OnInit} from '@angular/core';
import { NavigationEnd, RouterLink, Router, RouterLinkActive } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { RequestService } from '../../services/request.service';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgOptimizedImage, RouterLink, CommonModule, RouterLinkActive],
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router, private authService: AuthService, private requestService: RequestService) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntilDestroyed()
    ).subscribe(() => {
      this.closeMobileMenu();
      this.closeAnnouncement();
      this.showSavedToast = false;
      void this.refreshAuthentication();
    });
  }
  private accessToken: string | null | undefined;
  title: string = "";
  description: string = "";
  isAnnouncementOpen = false;
  isAdmin: boolean = this.authService.isAdmin();
  isUser: boolean = this.authService.isUser();
  isNotAuth: boolean = this.authService.isNotAuth();
  isSubscribed = false;
  // Toast
  showSavedToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  isMobileMenuOpen = false;


  async ngOnInit(): Promise<void> {
    void this.loadInfo();
    await this.refreshAuthentication();
  }

  private async refreshAuthentication(): Promise<void> {
    const token = localStorage.getItem('access_token');
    if (token === this.accessToken) return;
    this.accessToken = token;
    this.isAdmin = this.authService.isAdmin();
    this.isUser = this.authService.isUser();
    this.isNotAuth = this.authService.isNotAuth();
    this.isSubscribed = false;
    if (!token) return;
    await this.refreshSubscription();
  }

  private async refreshSubscription(): Promise<void> {
    const token = this.accessToken;
    try {
      const user = await this.requestService.request('GET', '/user', {}, {}, true);
      if (token === this.accessToken) this.isSubscribed = user.subscribed === true;
    } catch (err) {
      if (token === this.accessToken) this.isSubscribed = false;
    }
  }

  // Método para el click de preguntas guardadas si estas subscrito o no
  async onSavedClick(): Promise<void> {
    this.closeMobileMenu();
    await this.refreshAuthentication();
    if (this.accessToken) await this.refreshSubscription();
    if (!this.isSubscribed) {
      this.showToast(
        'Funcionalidad PREMIUM: debes estar susbcrito para acceder a Preguntas guardadas.',
        'error'
      );
      return;
    }
    this.router.navigate(['/preguntas-guardadas']);
  }

  // Método para el click de icono examanes si estas registrado o no
  onExamsClick(): void {
    this.closeMobileMenu();
    // Si NO está autenticado, mostramos aviso y no navegamos
    if (this.isNotAuth) {
      this.showToast('Debes estar registrado para acceder a la carpeta "Exámenes. Una vez registrado, podrás realizar exámenes OFICIALES".', 'error');
      return;
    }
    // Si está autenticado, navegamos
    this.router.navigate(['/examenes']);
  }

  // Método para mostrar mensaje si no estas subscrito 
  private showToast(msg: string, type: 'success' | 'error' = 'success') {
    this.toastMessage = msg;
    this.toastType = type;
    this.showSavedToast = true;
    setTimeout(() => (this.showSavedToast = false), 3500);
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  isRouteActive(path: string): boolean {
    return this.router.url === path || this.router.url.startsWith(`${path}/`);
  }


   // Método para cargar la información desde el servicio
  async loadInfo(): Promise<void> {
    try {
      const data = await this.requestService.request('GET', `/info`, {}, {}, false);
      this.title = data.title ?? '';
      this.description = data.description ?? '';
    } catch {
      this.title = '';
      this.description = '';
    }
  }

  openAnnouncement(): void {
    this.isAnnouncementOpen = true;
    this.closeMobileMenu();
  }

  closeAnnouncement(): void {
    this.isAnnouncementOpen = false;
  }


  logout(){
    this.closeMobileMenu();
    localStorage.removeItem('access_token');
    localStorage.removeItem('modalShown'); //para el aviso multicuenta
    localStorage.removeItem('userAnswer');
    localStorage.removeItem('correctedExamQuestions');

    window.location.reload();

  }



}
