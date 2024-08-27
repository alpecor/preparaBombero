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


  ngOnInit(): void {
    this.loadInfo();
  }

   // Método para cargar la información desde el servicio
   async loadInfo(): Promise<void> {
    const data = await this.requestService.request('GET', `http://localhost:3000/info`, {}, {}, false);
    this.title = data.title;
  }


  logout(){
    localStorage.removeItem('access_token');
    localStorage.removeItem('modalShown'); //para el aviso multicuenta
    localStorage.removeItem('userAnswer'); //para el aviso multicuenta
    localStorage.removeItem('correctedExamQuestions'); //para el aviso multicuenta

    this.router.navigate(['']);

  }



}
