import { inject, Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Subject } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { Position } from '../models/position';
import { AuthDataService } from '../../auth/services/auth-data.service';

@Injectable({
  providedIn: 'root',
})
export class LobbyService {
  private readonly authDataService = inject(AuthDataService);

  private readonly apiUrl = environment.apiUrl;

  private hubConnection?: HubConnection;

  private startGameSubject = new Subject<string>();
  startGame$ = this.startGameSubject.asObservable();

  connectPlayerToLobby(ships: Position[][]): void {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.apiUrl + 'lobby-hub', {
        accessTokenFactory: () =>
          this.authDataService.getAuthData().accessToken || '',
        withCredentials: false,
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => {
        console.log('SignalR connected');
        this.invokeConnectPlayer(ships);
      })
      .catch((err) => console.error('SignalR error: ', err));

    this.registerOnServerEvents();
  }

  private invokeConnectPlayer(ships: Position[][]): void {
    this.hubConnection!.invoke('ConnectPlayer', ships).catch((err) =>
      console.error(err)
    );
  }

  private registerOnServerEvents(): void {
    this.hubConnection!.on('StartGame', (gameId: string) => {
      this.startGameSubject.next(gameId);
    });
  }

  stopConnection(): void {
    if (this.hubConnection) {
      this.hubConnection.stop().then(() => console.log('SignalR disconnected'));
    }
  }
}
