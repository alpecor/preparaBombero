import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExamsInfoService {

  private urlApi = "http://localhost:3000/info";

  constructor(private http: HttpClient) {}

  //Método para realizar el GET de la cabecera negra
  getExamsInfo(): Observable<any>{
    return this.http.get<any>(this.urlApi);
  }

  //Método para realizar el PUT de actualización de la cabecera negra y listado de exámenes
  updateExamsInfo(data: { title: string, description: string }): Observable<any> {
    const access_token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${access_token}`
    });
    return this.http.put<any>(this.urlApi, data, { headers });
  }
}
