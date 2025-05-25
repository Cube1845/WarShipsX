import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

export abstract class ApiService<T> {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  constructor(
    private method: 'GET' | 'POST' | 'DELETE' | 'PUT',
    private endpoint: string,
    private payload?: any,
    private headers?: HttpHeaders,
    private pipeFn?: (obs: Observable<T>) => Observable<T>
  ) {}

  public request(): Observable<T> {
    const headers = {
      ...new HttpHeaders({ 'Content-Type': 'application/json' }),
      ...this.headers,
    };

    let request$: Observable<T>;

    const url = this.apiUrl + this.endpoint;

    switch (this.method) {
      case 'GET':
        request$ = this.http.get<T>(url, { headers });
        break;

      case 'DELETE':
        request$ = this.http.delete<T>(url, { headers });
        break;

      case 'POST':
        request$ = this.http.post<T>(url, this.payload, { headers });
        break;

      case 'PUT':
        request$ = this.http.put<T>(url, this.payload, { headers });
        break;

      default:
        throw new Error(`Unsupported HTTP method: ${this.method}`);
    }

    return this.pipeFn ? this.pipeFn(request$) : request$;
  }
}
