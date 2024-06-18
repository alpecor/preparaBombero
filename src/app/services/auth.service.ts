import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Route, Router } from '@angular/router';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private LOGIN_URL = ''; //Meter aquí el endpoint
  private tokenKey='authToken';

  constructor(private httpCLient: HttpClient, private router: Router) { }

  login(user: String, password: string){
    return this.httpCLient.post<any>(this.LOGIN_URL, {user, password}).pipe(
      tap(response=>{
        if(response.token){
          console.log(response.token);
        }
      })
    )
  }

  private setToken(token:string) {
    localStorage.setItem(this.tokenKey, token);
  }

  private getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated() {
    const token = this.getToken();
    if(!token){
      return false;
    }
    //para la expiración del token
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000;
    return Date.now()< exp;
  }

  logout(){
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login']);
  }
}
