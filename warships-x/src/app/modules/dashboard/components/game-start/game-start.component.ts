import { Component } from '@angular/core';
import { WsButtonComponent } from '../../../common/components/ws-button/ws-button.component';

@Component({
  selector: 'app-game-start',
  imports: [WsButtonComponent],
  templateUrl: './game-start.component.html',
  styleUrl: './game-start.component.scss',
})
export class GameStartComponent {
  userInQueue: boolean = false;
  playersWaitingCount: number = 0;

  joinQueue(): void {
    this.userInQueue = true;
  }

  leaveQueue(): void {
    this.userInQueue = false;
  }
}
