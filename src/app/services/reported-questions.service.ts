import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ReportedQuestionsService {

  private apiUrl = 'http://localhost:3000/report';

  constructor(private http: HttpClient) {}

  getReportedQuestions(){
    const access_token = localStorage.getItem("access_token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${access_token}`
    });

    return this.http.get<any>(this.apiUrl, { headers });
  }

  deleteReportedQuestion(id: number) {
    const access_token = localStorage.getItem("access_token");
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${access_token}`
    });
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url, { headers });
  }
}

