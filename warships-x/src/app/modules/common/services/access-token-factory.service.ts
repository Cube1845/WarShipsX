import { inject, Injectable } from '@angular/core';
import { AuthDataService } from '../../auth/services/auth-data.service';
import { AuthData } from '../../auth/models/auth-data';
import { firstValueFrom } from 'rxjs';
import { HttpClient, HttpContext } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { SKIP_AUTH } from '../../auth/models/http-context-tokens';

@Injectable({
  providedIn: 'root',
})
export class AccessTokenFactoryService {
  private readonly authDataService = inject(AuthDataService);
  private readonly http = inject(HttpClient);

  private readonly apiUrl = environment.apiUrl;

  async getValidAccessToken(): Promise<string> {
    const authData = this.authDataService.getAuthData();

    if (!this.isTokenExpired(authData)) {
      return authData?.accessToken || '';
    }

    const newAuthData = await this.refreshToken(authData);

    return newAuthData?.accessToken || '';
  }

  private isTokenExpired(authData: AuthData | null): boolean {
    if (!authData?.accessToken || !authData?.accessExpiryDateTime) {
      return true;
    }

    const expiryDate = new Date(authData.accessExpiryDateTime);
    const now = new Date();

    return expiryDate <= now;
  }

  private async refreshToken(authData: AuthData): Promise<AuthData | null> {
    const payload = {
      userId: authData.userId,
      refreshToken: authData.refreshToken,
    };

    try {
      const newAuthData = await firstValueFrom(
        this.http.post<AuthData>(this.apiUrl + 'auth/refresh', payload, {
          context: new HttpContext().set(SKIP_AUTH, true),
        })
      );

      this.authDataService.setAuthData(newAuthData);

      return newAuthData;
    } catch (error) {
      console.error('Token refresh failed for SignalR', error);

      return null;
    }
  }
}
