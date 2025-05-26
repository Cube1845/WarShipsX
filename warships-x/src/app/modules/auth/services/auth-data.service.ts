import { Injectable } from '@angular/core';
import { AuthData } from '../models/auth-data';

@Injectable({
  providedIn: 'root',
})
export class AuthDataService {
  setAuthData(data: AuthData): void {
    localStorage.setItem('userId', data.userId!);
    localStorage.setItem('accessToken', data.accessToken!);
    localStorage.setItem('accessExpiryDateTime', data.accessExpiryDateTime!);
    localStorage.setItem('refreshToken', data.refreshToken!);
  }

  clearAuthData(): void {
    localStorage.clear();
  }

  getAuthData(): AuthData {
    const data: AuthData = {
      userId: localStorage.getItem('userId'),
      accessToken: localStorage.getItem('accessToken'),
      accessExpiryDateTime: localStorage.getItem('accessExpiryDateTime'),
      refreshToken: localStorage.getItem('refreshToken'),
    };

    return data;
  }

  isAuthDataSet(): boolean {
    return (
      localStorage.getItem('userId') != null &&
      localStorage.getItem('accessToken') != null &&
      localStorage.getItem('accessExpiryDateTime') != null &&
      localStorage.getItem('refreshToken') != null
    );
  }
}
