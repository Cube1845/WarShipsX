import { Injectable } from '@angular/core';
import { HubService } from '../../common/models/hub-service';
import { Subject } from 'rxjs';
import { PlayerData } from '../models/player-data';

@Injectable({
  providedIn: 'root',
})
export class GameService extends HubService {
  private connectionClosedSubject = new Subject<boolean>();
  connectionClosed$ = this.connectionClosedSubject.asObservable();

  private playerDataSentSubject = new Subject<PlayerData>();
  playerDataSent$ = this.playerDataSentSubject.asObservable();

  private opponentDisconnectedSubject = new Subject<boolean>();
  opponentDisconnected$ = this.opponentDisconnectedSubject.asObservable();

  private opponentConnectedSubject = new Subject<boolean>();
  opponentConnected$ = this.opponentConnectedSubject.asObservable();

  private opponentAbandonedSubject = new Subject<boolean>();
  opponentAbandoned$ = this.opponentAbandonedSubject.asObservable();

  private registerEvents(): void {
    this.hubConnection?.onclose(() => this.connectionClosedSubject.next(true));

    this.registerEvent('PlayerDataSent', (data) =>
      this.playerDataSentSubject.next(data)
    );

    this.registerEvent('OpponentDisconnected', () =>
      this.opponentDisconnectedSubject.next(true)
    );

    this.registerEvent('OpponentConnected', () =>
      this.opponentConnectedSubject.next(true)
    );

    this.registerEvent('OpponentAbandoned', () =>
      this.opponentAbandonedSubject.next(true)
    );
  }

  constructor() {
    super('game-hub', () => this.registerEvents());
  }
}
