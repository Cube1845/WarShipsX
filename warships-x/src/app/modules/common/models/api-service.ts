import { HttpClient, HttpContext, HttpHeaders } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { SKIP_AUTH } from '../../auth/models/http-context-tokens';

export abstract class ApiService<T> {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  constructor(
    private method: 'GET' | 'POST' | 'DELETE' | 'PUT',
    private endpoint: string,
    private skipAuth?: boolean,
    private headers?: HttpHeaders
  ) {}

  request(
    payload?: any,
    queryParams?: Record<string, string | number | boolean>
  ): Observable<T> {
    let url = this.apiUrl + this.endpoint;

    if (queryParams && Object.keys(queryParams).length > 0) {
      const queryString = Object.entries(queryParams)
        .map(
          ([key, value]) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
        )
        .join('&');
      url += `?${queryString}`;
    }

    const finalHeaders =
      this.headers || new HttpHeaders({ 'Content-Type': 'application/json' });

    let request$: Observable<T>;

    switch (this.method) {
      case 'GET':
        request$ = this.http.get<T>(url, {
          headers: finalHeaders,
          context: this.skipAuth
            ? new HttpContext().set(SKIP_AUTH, true)
            : undefined,
        });
        break;

      case 'DELETE':
        request$ = this.http.delete<T>(url, {
          headers: finalHeaders,
          context: this.skipAuth
            ? new HttpContext().set(SKIP_AUTH, true)
            : undefined,
        });
        break;

      case 'POST':
        request$ = this.http.post<T>(url, payload, {
          headers: finalHeaders,
          context: this.skipAuth
            ? new HttpContext().set(SKIP_AUTH, true)
            : undefined,
        });
        break;

      case 'PUT':
        request$ = this.http.put<T>(url, payload, {
          headers: finalHeaders,
          context: this.skipAuth
            ? new HttpContext().set(SKIP_AUTH, true)
            : undefined,
        });
        break;

      default:
        throw new Error(`Unsupported HTTP method: ${this.method}`);
    }

    return request$;
  }
}
