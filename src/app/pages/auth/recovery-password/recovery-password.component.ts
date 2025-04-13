import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RequestService } from '../../../services/request.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-recovery-password',
  standalone: true,
  imports: [RouterLink,NgOptimizedImage, FormsModule],
  templateUrl: './recovery-password.component.html',
  styleUrl: './recovery-password.component.css'
})
export class RecoveryPasswordComponent {
  password:string ='';
  repeatPassword:string ='';
  token: string = '';

  constructor(private router: Router, private requestService: RequestService, private route: ActivatedRoute) {
    // se captura el token desde la URL
    this.token = this.route.snapshot.paramMap.get('token') || '';
  }
  
  
  async recoveryPassword(){
    // se valida que ambos campos estén rellenos
    if (!this.password || !this.repeatPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos vacíos',
        text: 'Por favor, rellena ambos campos de contraseña.',
        confirmButtonColor: '#d33'
      });
      return;
    }
  
    // se valida que ambas contraseñas coincidan
    if (this.password !== this.repeatPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'Contraseñas no coinciden',
        text: 'Asegúrate de que ambas contraseñas sean iguales.',
        confirmButtonColor: '#d33'
      });
      return;
    }
  
    // se valida que el token no haya expirado
    if (!this.token) {
      Swal.fire({
        icon: 'error',
        title: 'Token no válido',
        text: 'El enlace para restablecer la contraseña no es válido o ha expirado.',
        confirmButtonColor: '#d33'
      });
      return;
    }
    

    // si todo es correcto, se realiza la petición
    try {
      const body = {
        token: this.token,
        password: this.password,
        repeatPassword: this.repeatPassword
      };

      await this.requestService.request('POST','/auth/recoverypassword',body,{},false);

      Swal.fire({
        icon: 'success',
        title: 'Contraseña actualizada',
        text: 'Tu contraseña se ha cambiado correctamente. Ya puedes iniciar sesión.',
        confirmButtonColor: '#f59e0b'
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/login']);
        }
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error al cambiar contraseña',
        text: 'Ha ocurrido un error inesperado. Intenta de nuevo más tarde.',
        confirmButtonColor: '#d33'
      });
      console.error(error);
    }
  }

}

