import { inject } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { AuthDataService } from '../../auth/services/auth-data.service';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { from, Observable, of } from 'rxjs';

export abstract class HubService {
  private readonly authDataService = inject(AuthDataService);
  private readonly apiUrl = environment.apiUrl;

  protected hubConnection?: HubConnection;

  constructor(
    private hubUrl: string,
    private registerOnServerEvents?: () => void
  ) {}

  connect(): Observable<void> {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.apiUrl + this.hubUrl, {
        accessTokenFactory: () =>
          this.authDataService.getAuthData().accessToken || '',
        withCredentials: false,
      })
      .withAutomaticReconnect()
      .build();

    if (this.registerOnServerEvents) {
      this.registerOnServerEvents();
    }

    return from(this.hubConnection.start());
  }

  invoke(message: string, data?: any): Observable<void> {
    return !!data
      ? from(this.hubConnection!.invoke(message, data))
      : from(this.hubConnection!.invoke(message));
  }

  stopConnection(): Observable<void> {
    if (this.hubConnection) {
      return from(this.hubConnection.stop());
    }

    return of();
  }
}
