import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';


export const userAuthGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);
  const authService: AuthService = inject(AuthService);
  if(authService.isUser() || authService.isAdmin()){
    return true;
  }
  console.log("se ejecuta linea 111111")
  router.navigate(['/']);
  return false;
};

