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
  status: undefined;


  async register(){
    try{
      const response = await this.requestService.request('POST', `http://localhost:3000/auth/register`, {name: this.name, surname: this.surname, email: this.email, password:this.password, repeatPassword:this.repeatPassword}, {}, false);
      console.log(response);
      this.status = undefined
      this.router.navigate(['/login']);
    }catch(error: any){
      this.status = Array.isArray(error.error.message) ? error.error.message : [error.error.message];
    }
  }
}
