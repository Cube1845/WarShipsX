import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HubService } from '../../common/models/hub-service';
import { Position } from '../models/position';

@Injectable({
  providedIn: 'root',
})
export class LobbyService extends HubService {
  private startGameSubject = new Subject<string>();
  startGame$ = this.startGameSubject.asObservable();

  private playersCountChangedSubject = new Subject<number>();
  playersCountChanged$ = this.playersCountChangedSubject.asObservable();

  private registerEvents(): void {
    this.hubConnection!.on('StartGame', (gameId: string) => {
      this.startGameSubject.next(gameId);
    });

    this.hubConnection!.on('PlayersCountChanged', (count: number) => {
      this.playersCountChangedSubject.next(count);
    });
  }

  constructor() {
    super('lobby-hub', () => this.registerEvents());
  }

  joinLobby(ships: Position[][]): Observable<void> {
    return this.invoke('JoinLobby', ships);
  }

  leaveLobby(): Observable<void> {
    return this.invoke('LeaveLobby');
  }
}
