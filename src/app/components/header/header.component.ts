import { NgOptimizedImage } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { NavigationEnd, RouterLink, Router, RouterLinkActive } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { RequestService } from '../../services/request.service';
import { decodeAnnouncementPages } from '../../services/announcement-content';

interface PlatformUpdate {
  id: string;
  eyebrow: string;
  title: string;
  icon: string;
  contentHtml: string;
}


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgOptimizedImage, RouterLink, CommonModule, RouterLinkActive],
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('promoViewport') private promoViewport?: ElementRef<HTMLElement>;
  @ViewChild('promoMessage') private promoMessage?: ElementRef<HTMLElement>;

  constructor(
    private router: Router,
    private authService: AuthService,
    private requestService: RequestService,
    private ngZone: NgZone
  ) {
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
  isAnnouncementOpen = false;
  activeAnnouncementPage = 0;
  isPromoOverflowing = false;
  promoDurationSeconds = 18;
  announcementSummary = '';
  announcementPages: PlatformUpdate[] = [];
  private promoResizeObserver?: ResizeObserver;
  private promoMeasureTimer?: ReturnType<typeof setTimeout>;
  isAdmin: boolean = this.authService.isAdmin();
  isUser: boolean = this.authService.isUser();
  isNotAuth: boolean = this.authService.isNotAuth();
  isSubscribed = false;
  // Toast
  showSavedToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  isMobileMenuOpen = false;
  isAdminMenuOpen = false;


  async ngOnInit(): Promise<void> {
    void this.loadInfo();
    await this.refreshAuthentication();
  }

  ngAfterViewInit(): void {
    this.observePromoWidth();
    this.schedulePromoMeasurement();
  }

  ngOnDestroy(): void {
    this.promoResizeObserver?.disconnect();
    if (this.promoMeasureTimer) clearTimeout(this.promoMeasureTimer);
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

  // Las preguntas oficiales guardadas requieren Premium. Los compradores de
  // packs también pueden acceder para consultar las favoritas de sus packs.
  async onSavedClick(): Promise<void> {
    this.closeMobileMenu();
    await this.refreshAuthentication();
    if (this.accessToken) await this.refreshSubscription();
    if (!this.isSubscribed) {
      try {
        const packs = await this.requestService.request('GET', '/pack', {}, {}, true);
        const hasPurchasedPack = Array.isArray(packs) && packs.some((pack: any) => pack.purchased === true);
        if (!hasPurchasedPack) {
          this.showToast(
            'Preguntas guardadas está disponible con Premium o al comprar un pack de refuerzo.',
            'error'
          );
          return;
        }
      } catch {
        this.showToast('No se ha podido comprobar el acceso a Preguntas guardadas.', 'error');
        return;
      }
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
    if (!this.isMobileMenuOpen) this.isAdminMenuOpen = false;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
    this.isAdminMenuOpen = false;
  }

  toggleAdminMenu(): void {
    this.isAdminMenuOpen = !this.isAdminMenuOpen;
  }

  isAdminSectionActive(): boolean {
    return this.router.url === '/admin' || this.router.url.startsWith('/admin/');
  }

  @HostListener('document:click')
  closeAdminMenu(): void {
    this.isAdminMenuOpen = false;
  }

  @HostListener('document:keydown.escape')
  closeAdminMenuOnEscape(): void {
    this.isAdminMenuOpen = false;
    this.closeAnnouncement();
  }

  isRouteActive(path: string): boolean {
    return this.router.url === path || this.router.url.startsWith(`${path}/`);
  }


   // Método para cargar la información desde el servicio
  async loadInfo(): Promise<void> {
    try {
      const data = await this.requestService.request('GET', `/info`, {}, {}, false);
      this.announcementSummary = (data.title ?? '').trim();
      this.announcementPages = decodeAnnouncementPages(
        data.description,
        data.title,
        true
      ).map((page, index) => ({
        id: String(index),
        eyebrow: 'Novedades de la plataforma',
        title: page.title,
        icon: 'fa-bullhorn',
        contentHtml: page.content,
      }));
    } catch {
      this.announcementSummary = '';
      this.announcementPages = [];
    } finally {
      this.activeAnnouncementPage = Math.min(
        this.activeAnnouncementPage,
        Math.max(this.announcementPages.length - 1, 0)
      );
      this.observePromoWidth();
      this.schedulePromoMeasurement();
    }
  }

  openAnnouncement(): void {
    if (!this.announcementPages.length) return;
    this.activeAnnouncementPage = 0;
    this.isAnnouncementOpen = true;
    this.closeMobileMenu();
  }

  closeAnnouncement(): void {
    this.isAnnouncementOpen = false;
  }

  showAnnouncementPage(index: number): void {
    if (index < 0 || index >= this.announcementPages.length) return;
    this.activeAnnouncementPage = index;
  }

  previousAnnouncement(): void {
    this.showAnnouncementPage(this.activeAnnouncementPage - 1);
  }

  nextAnnouncement(): void {
    this.showAnnouncementPage(this.activeAnnouncementPage + 1);
  }

  private observePromoWidth(): void {
    if (typeof ResizeObserver === 'undefined' || !this.promoViewport) return;
    this.promoResizeObserver?.disconnect();
    this.promoResizeObserver = new ResizeObserver(() => {
      this.ngZone.run(() => this.measurePromoOverflow());
    });
    this.promoResizeObserver.observe(this.promoViewport.nativeElement);
  }

  private schedulePromoMeasurement(): void {
    if (this.promoMeasureTimer) clearTimeout(this.promoMeasureTimer);
    this.promoMeasureTimer = setTimeout(() => {
      this.observePromoWidth();
      this.measurePromoOverflow();
    });
  }

  private measurePromoOverflow(): void {
    const viewport = this.promoViewport?.nativeElement;
    const message = this.promoMessage?.nativeElement;
    if (!viewport || !message) return;

    const messageWidth = message.scrollWidth;
    this.isPromoOverflowing = messageWidth > viewport.clientWidth + 1;
    this.promoDurationSeconds = Math.max(14, Math.min(32, Math.round(messageWidth / 52)));
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
