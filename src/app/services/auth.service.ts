import { Injectable } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  isAdmin(){
    const access_token:string|null = localStorage.getItem('access_token')
    if(access_token){
      const payload:any = jwtDecode(access_token)
      if (payload.role == "ADMIN") {
        return true;
      }
    }
    return false;
  }

  isUser(){
    const access_token:string|null = localStorage.getItem('access_token')
    if(access_token){
      const payload:any = jwtDecode(access_token)
      if (payload.role == "USER") {
        return true;
      }
    }
    return false;
  }

  isNotAuth(){
    const access_token:string|null = localStorage.getItem('access_token')
    if(!access_token){
        return true;
    }
    return false;
  }
}

