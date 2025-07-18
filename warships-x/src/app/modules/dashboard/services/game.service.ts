import { Injectable } from '@angular/core';
import { HubService } from '../../common/models/hub-service';
import { Observable, Subject } from 'rxjs';
import { PlayerData } from '../models/player-data';
import { Position } from '../models/position';
import { Shot } from '../models/shot';
import { Ship } from '../models/ship';

@Injectable({
  providedIn: 'root',
})
export class GameService extends HubService {
  private connectionClosedSubject = new Subject<void>();
  connectionClosed$ = this.connectionClosedSubject.asObservable();

  private playerDataSentSubject = new Subject<PlayerData>();
  playerDataSent$ = this.playerDataSentSubject.asObservable();

  private opponentConnectedSubject = new Subject<void>();
  opponentConnected$ = this.opponentConnectedSubject.asObservable();

  private opponentAbandonedSubject = new Subject<void>();
  opponentAbandoned$ = this.opponentAbandonedSubject.asObservable();

  private opponentShotSubject = new Subject<Position>();
  opponentShot$ = this.opponentShotSubject.asObservable();

  private shotFeedbackSubject = new Subject<Shot>();
  shotFeedback$ = this.shotFeedbackSubject.asObservable();

  private waitForOpponentSubject = new Subject<void>();
  waitForOpponent$ = this.waitForOpponentSubject.asObservable();

  private gameEndedSubject = new Subject<Ship[] | null>();
  gameEnded$ = this.gameEndedSubject.asObservable();

  private gameTiedSubject = new Subject<void>();
  gameTied$ = this.gameTiedSubject.asObservable();

  private registerEvents(): void {
    this.hubConnection?.onclose(() => this.connectionClosedSubject.next());

    this.registerEvent('PlayerDataSent', (data) =>
      this.playerDataSentSubject.next(data)
    );

    this.registerEvent('OpponentConnected', () =>
      this.opponentConnectedSubject.next()
    );

    this.registerEvent('OpponentAbandoned', () =>
      this.opponentAbandonedSubject.next()
    );

    this.registerEvent('OpponentShot', (position) =>
      this.opponentShotSubject.next(position)
    );

    this.registerEvent('ShotFeedback', (shot) =>
      this.shotFeedbackSubject.next(shot)
    );

    this.registerEvent('WaitForOpponent', () =>
      this.waitForOpponentSubject.next()
    );

    this.registerEvent('GameEnded', (winnerShips) =>
      this.gameEndedSubject.next(winnerShips)
    );

    this.registerEvent('GameTied', () => this.gameTiedSubject.next());
  }

  constructor() {
    super('game-hub', () => this.registerEvents());
  }

  abandonGame(): Observable<void> {
    return this.invoke('AbandonGame');
  }

  shoot(position: Position): void {
    this.invoke('Shoot', position);
  }
}
