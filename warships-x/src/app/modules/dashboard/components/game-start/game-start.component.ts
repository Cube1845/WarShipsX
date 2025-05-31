import { Component, inject, signal } from '@angular/core';
import { WsButtonComponent } from '../../../common/components/ws-button/ws-button.component';
import { BattlefieldBoardComponent } from '../battlefield-board/battlefield-board.component';
import { SettingShipsService } from '../../services/setting-ships.service';
import { Position } from '../../models/position';

@Component({
  selector: 'app-game-start',
  imports: [WsButtonComponent, BattlefieldBoardComponent],
  templateUrl: './game-start.component.html',
  styleUrl: './game-start.component.scss',
})
export class GameStartComponent {
  private readonly settingShipsService = inject(SettingShipsService);

  userInQueue = signal<boolean>(false);
  playersWaitingCount = signal<number>(0);

  editState = signal<boolean>(false);

  editType: 4 | 3 | 2 | 1 | undefined;

  fourShip = signal<Position[]>(this.settingShipsService.fourShip);

  fourShipEdit(): void {
    this.editState.set(true);
    this.editType = 4;
  }

  fourShipClick(pos: Position): void {
    if (
      this.settingShipsService.fourShip.some(
        (x) => x.letter == pos.letter && x.number == pos.number
      )
    ) {
      this.settingShipsService.fourShip.forEach((x, i) => {
        if (x.letter == pos.letter && x.number == pos.number) {
          this.settingShipsService.fourShip.splice(i);
        }
      });
      return;
    }

    this.settingShipsService.fourShip.push(pos);
  }

  fieldClick(pos: Position): void {
    if (!this.editState()) {
      return;
    }

    switch (this.editType) {
      case 4:
        this.fourShipClick(pos);
        break;
      default:
        break;
    }
  }

  cancelEdit(): void {
    this.editState.set(false);
    this.editType = undefined;
  }

  joinQueue(): void {
    this.userInQueue.set(true);
  }

  leaveQueue(): void {
    this.userInQueue.set(false);
  }
}
