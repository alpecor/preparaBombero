import { NgOptimizedImage } from '@angular/common';
import { Component, OnInit} from '@angular/core';
import { RouterLink, Router, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { RequestService } from '../../services/request.service';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgOptimizedImage, RouterLink, CommonModule, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router, private authService: AuthService, private requestService: RequestService) {}
  title: string = "";
  isAdmin: boolean = this.authService.isAdmin();
  isUser: boolean = this.authService.isUser();
  isNotAuth: boolean = this.authService.isNotAuth();
  isSubscribed = false;
  // Toast
  showSavedToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';


  async ngOnInit(): Promise<void> {
    this.loadInfo();
    
    //para saber si el usuario esta subscrito
    try {
      const user = await this.requestService.request('GET', '/user', {}, {}, true);
      this.isSubscribed = user.subscribed === true;
    } catch (err) {
      this.isSubscribed = false;
    }
  }

  // Método para el click de preguntas guardadas si estas subscrito o no
  onSavedClick(): void {
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


   // Método para cargar la información desde el servicio
   async loadInfo(): Promise<void> {
    const data = await this.requestService.request('GET', `/info`, {}, {}, false);
    this.title = data.title;
  }


  logout(){
    localStorage.removeItem('access_token');
    localStorage.removeItem('modalShown'); //para el aviso multicuenta
    localStorage.removeItem('userAnswer');
    localStorage.removeItem('correctedExamQuestions');

    window.location.reload();

  }



}
