import { Injectable } from '@angular/core';
import { HubService } from '../../common/models/hub-service';
import { Subject } from 'rxjs';
import { PlayerData } from '../models/player-data';

@Injectable({
  providedIn: 'root',
})
export class GameService extends HubService {
  private playerDataSentSubject = new Subject<PlayerData>();
  playerDataSent$ = this.playerDataSentSubject.asObservable();

  private registerEvents(): void {
    this.registerEvent('PlayerDataSent', (data) =>
      this.playerDataSentSubject.next(data)
    );
  }

  constructor() {
    super('game-hub', () => this.registerEvents());
  }
}
