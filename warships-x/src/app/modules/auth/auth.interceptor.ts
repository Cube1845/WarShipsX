import {
  HttpClient,
  HttpContext,
  HttpEvent,
  HttpInterceptorFn,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { AuthDataService } from './services/auth-data.service';
import { SKIP_AUTH } from './models/http-context-tokens';
import { AuthData } from './models/auth-data';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.context.get(SKIP_AUTH)) {
    return next(req);
  }

  const authDataService = inject(AuthDataService);

  const authData = authDataService.getAuthData();
  if (!authData || !authData.accessToken || !authData.accessExpiryDateTime) {
    return next(req);
  }

  const expiryDate = new Date(authData.accessExpiryDateTime);
  const now = new Date();

  if (expiryDate > now) {
    return handleRequestWithToken(req, next, authData.accessToken);
  }

  const http = inject(HttpClient);

  const refreshTokenPayload = {
    userId: authData.userId,
    refreshToken: authData.refreshToken,
  };

  return http
    .post<AuthData>(environment.apiUrl + 'auth/refresh', refreshTokenPayload, {
      context: new HttpContext().set(SKIP_AUTH, true),
    })
    .pipe(
      switchMap((newAuthData) => {
        authDataService.setAuthData(newAuthData);
        return handleRequestWithToken(req, next, newAuthData.accessToken!);
      }),
      catchError(() => {
        return throwError(() => new Error('Token refresh failed'));
      })
    );
};

function handleRequestWithToken(
  req: any,
  next: any,
  token: string
): Observable<HttpEvent<unknown>> {
  const authRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(authRequest);
}
