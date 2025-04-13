import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RequestService } from '../../../services/request.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [RouterLink,NgOptimizedImage, FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  constructor(private router: Router, private requestService: RequestService) {}
  
  email:string ='';

  
  async resetPassword(){
    // se comprueba primero si el campo email se ha rellenado o si es un email correcto
    if (!this.email) {
      Swal.fire({
        icon: 'warning',
        title: 'Campo vacío',
        text: 'Por favor, introduce tu email',
        confirmButtonColor: '#d33'
      });
      return;
    }

    // se comprueba si es un email válido
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      Swal.fire({
        icon: 'warning',
        title: 'Email no válido',
        text: 'Por favor, introduce un formato de email válido',
        confirmButtonColor: '#d33'
      });
      return;
    }

    // si todo es correcto, se realiza la petición
    try {
      const response = await this.requestService.request(
        'POST',
        `/auth/resetpassword`,
        { email: this.email },
        {},
        false
      );
        
      Swal.fire({
        icon: 'success',
        title: 'Correo enviado',
        html: `Se ha enviado un correo de recuperación a <strong>${this.email}</strong>, asegúrate de revisar la bandeja de Spam si no lo ves.`,
        confirmButtonColor: '#f59e0b' 
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/login']);
        }
      });
  
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ha ocurrido un error al intentar enviar el correo. Inténtalo de nuevo más tarde.',
        confirmButtonColor: '#d33'
      });
    }
  }

}
