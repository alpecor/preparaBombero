import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExamsInfoService {

  private urlApi = "http://localhost:3000/info";

  constructor(private http: HttpClient) {}

  getExamsInfo(): Observable<any>{
    return this.http.get<any>(this.urlApi);
  }
}
