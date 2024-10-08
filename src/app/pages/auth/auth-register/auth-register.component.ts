import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { RequestService } from '../../../services/request.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink,NgOptimizedImage, FormsModule],
  templateUrl: './auth-register.component.html',
  styleUrl: './auth-register.component.css'
})
export class AuthRegisterComponent {
  constructor(private router: Router, private requestService: RequestService) {}

  name:string ='';
  surname:string ='';
  email:string ='';
  password:string ='';
  repeatPassword:string ='';
  status: string[] | undefined;


  async register(){
    try{
      const response = await this.requestService.request('POST', `/auth/register`, {name: this.name, surname: this.surname, email: this.email, password:this.password, repeatPassword:this.repeatPassword}, {}, false);
      this.status = undefined
      this.router.navigate(['/login']);
    }catch(error: any){
      this.status = (error.error.errors) ? Array.isArray(error.error.errors) ? error.error.errors : [error.error.errors] : [error.error.message];
    }
  }
}
