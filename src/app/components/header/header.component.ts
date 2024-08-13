import { NgOptimizedImage } from '@angular/common';
import { Component, OnInit} from '@angular/core';
import { RouterLink, Router, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ExamsInfoService } from '../../services/exams-info.service';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgOptimizedImage, RouterLink, CommonModule, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  data: any = {};

  constructor(private router: Router, private authService: AuthService, private examsInfoService: ExamsInfoService) {}

  ngOnInit(): void {
    this.getExamsInfo();
  }

  getExamsInfo(){
    this.examsInfoService.getExamsInfo().subscribe( data => {
      this.data = data;
      console.log(this.data);
    });
  }


  title: string = "";
  isAdmin: boolean = this.authService.isAdmin();
  isUser: boolean = this.authService.isUser();
  isNotAuth: boolean = this.authService.isNotAuth();

  logout(){
    localStorage.removeItem('access_token');
    this.router.navigate(['']);
  }



}
