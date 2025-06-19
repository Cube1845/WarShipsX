import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HubService } from '../../common/models/hub-service';
import { Ship } from '../models/ship';

@Injectable({
  providedIn: 'root',
})
export class LobbyService extends HubService {
  private playersCountChangedSubject = new Subject<number>();
  playersCountChanged$ = this.playersCountChangedSubject.asObservable();

  private startGameSubject = new Subject<boolean>();
  startGame$ = this.startGameSubject.asObservable();

  private playerParticipatesSubject = new Subject<boolean>();
  playerParticipates$ = this.playerParticipatesSubject.asObservable();

  private registerEvents(): void {
    this.registerEvent('StartGame', () => this.startGameSubject.next(true));

    this.registerEvent('PlayersCountChanged', (count: number) => {
      this.playersCountChangedSubject.next(count);
    });

    this.registerEvent('PlayerParticipatesInGame', () => {
      this.playerParticipatesSubject.next(true);
    });
  }

  constructor() {
    super('lobby-hub', () => this.registerEvents());
  }

  joinLobby(ships: Ship[]): Observable<void> {
    return this.invoke('JoinLobby', ships);
  }

  leaveLobby(): Observable<void> {
    return this.invoke('LeaveLobby');
  }
}
