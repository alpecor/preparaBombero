import { NgOptimizedImage, NgStyle, CommonModule } from '@angular/common';
import { Component} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RequestService } from '../../../services/request.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgOptimizedImage, RouterLink, NgStyle, FormsModule, CommonModule],
  templateUrl: './auth-login.component.html',
  styleUrl: './auth-login.component.css'
})
export default class AuthLoginComponent {
  constructor(private router: Router, private requestService: RequestService) {}

  email:string ='';
  password:string='';
  status: string[] | undefined;


  async login(){
    try{
      const response = await this.requestService.request('POST', `/auth/login`, {email: this.email, password:this.password}, {}, false);
      localStorage.setItem("access_token", response.access_token);
      this.status = undefined;
      this.router.navigate(['/home']);
    }catch(error: any){
      this.status = (error.error.errors) ? Array.isArray(error.error.errors) ? error.error.errors : [error.error.errors] : [error.error.message];
    }
  }



}
