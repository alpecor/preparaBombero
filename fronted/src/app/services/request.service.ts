import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  constructor(private httpClient: HttpClient, private router: Router) {}

  async request(method: string, uri: string, data: any, headers: any, auth: boolean = true) {
    if (['GET', 'DELETE'].includes(method)) {
      uri = this.serializeUrl(uri, data);
    }
    if (auth) {
      const access_token = localStorage.getItem('access_token');
      headers = { ...headers, Authorization: 'Bearer ' + access_token };
    }

    try {
      const response = await this.doRequest(uri, method, data, headers);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async doRequest(uri: string, method: string, data: any, headers: any) {
    try {
      let httpResponse: Promise<any>;
      switch (method) {
        case 'GET':
          httpResponse = lastValueFrom(this.httpClient.get(uri, { headers }));
          break;
        case 'POST':
          httpResponse = lastValueFrom(this.httpClient.post(uri, data, { headers }));
          break;
        case 'PUT':
          httpResponse = lastValueFrom(this.httpClient.put(uri, data, { headers }));
          break;
        case 'DELETE':
          httpResponse = lastValueFrom(this.httpClient.delete(uri, { headers }));
          break;
        default:
          throw new Error('Invalid HTTP method');
      }
      const response = await httpResponse;
      return response;
    } catch (error) {
      const accessToken = localStorage.getItem('access_token');
      if (accessToken) {
        const exp = JSON.parse(atob(accessToken.split('.')[1])).exp * 1000;
        if (new Date().getTime() >= exp) {
          localStorage.clear();
          this.router.navigate(['/']);
        }
      }
      throw error;
    }
  }

  serializeUrl(uri: string, params: any) {
    const str = [];

    for (const p in params) {
      if (params.hasOwnProperty(p) && params[p] !== null) {
        str.push(`${encodeURIComponent(p)}=${encodeURIComponent(params[p])}`);
      }
    }

    if (str.length) {
      return `${uri}?${str.join('&')}`;
    } else {
      return uri;
    }
  }
}
