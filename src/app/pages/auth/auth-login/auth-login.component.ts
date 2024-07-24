import { NgOptimizedImage, NgStyle } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RequestService } from '../../../services/request.service';
import { routes } from '../../../app.routes';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgOptimizedImage, RouterLink, NgStyle, FormsModule],
  templateUrl: './auth-login.component.html',
  styleUrl: './auth-login.component.css'
})
export default class AuthLoginComponent {
  constructor(private router: Router, private requestService: RequestService) {}

  email:string ='';
  password:string='';
  status: undefined;


  async login(){
    try{
      const response = await this.requestService.request('POST', `http://localhost:3000/auth/login`, {email: this.email, password:this.password}, {}, false);
      localStorage.setItem("access_token", response.access_token);
      this.status = undefined
      this.router.navigate(['/home']);
    }catch(error: any){
      this.status = Array.isArray(error.error.message) ? error.error.message : [error.error.message];
    }
  }



}
