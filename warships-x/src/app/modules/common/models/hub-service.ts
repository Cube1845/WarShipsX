import { inject } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { from, Observable, of } from 'rxjs';
import { AccessTokenFactoryService } from '../services/access-token-factory.service';

export abstract class HubService {
  private readonly accessTokenFactory = inject(AccessTokenFactoryService);

  private readonly apiUrl = environment.apiUrl;

  hubConnection?: HubConnection;

  constructor(
    private hubUrl: string,
    private registerOnServerEvents?: () => void
  ) {}

  connect(): Observable<void> {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.apiUrl + this.hubUrl, {
        accessTokenFactory: () => this.accessTokenFactory.getValidAccessToken(),
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

  protected registerEvent(message: string, fn: (data?: any) => void): void {
    this.hubConnection!.on(message, fn);
  }

  disconnect(): Observable<void> {
    if (this.hubConnection) {
      return from(this.hubConnection.stop());
    }

    return of();
  }
}
