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

  private startGameSubject = new Subject<void>();
  startGame$ = this.startGameSubject.asObservable();

  private playerParticipatesSubject = new Subject<void>();
  playerParticipates$ = this.playerParticipatesSubject.asObservable();

  private registerEvents(): void {
    this.registerEvent('StartGame', () => this.startGameSubject.next());

    this.registerEvent('PlayersCountChanged', (count: number) => {
      this.playersCountChangedSubject.next(count);
    });

    this.registerEvent('PlayerParticipatesInGame', () => {
      this.playerParticipatesSubject.next();
    });
  }

  constructor() {
    super('lobby-hub', () => this.registerEvents());
  }

  joinQueue(ships: Ship[]): Observable<void> {
    return this.invoke('JoinQueue', ships);
  }

  leaveQueue(): Observable<void> {
    return this.invoke('LeaveQueue');
  }
}
