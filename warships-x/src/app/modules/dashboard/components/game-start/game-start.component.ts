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
  threeShips = signal<Position[][]>(this.settingShipsService.threeShips);
  twoShips = signal<Position[][]>(this.settingShipsService.twoShips);
  oneShips = signal<Position[][]>(this.settingShipsService.oneShips);

  shipEdit(shipSize: 4 | 3 | 2 | 1): void {
    if (this.editState() && this.editType == shipSize) {
      this.cancelEdit();
      return;
    }

    this.editState.set(true);
    this.editType = shipSize;
  }

  fourShipClick(pos: Position): void {
    this.settingShipsService.addShipPosition(
      pos,
      this.settingShipsService.fourShip,
      4
    );
  }

  threeShipClick(pos: Position): void {
    this.settingShipsService.modifyShips(
      pos,
      this.settingShipsService.threeShips,
      3
    );
  }

  fieldClick(pos: Position): void {
    if (!this.editState()) {
      return;
    }

    switch (this.editType) {
      case 4:
        this.fourShipClick(pos);
        break;
      case 3:
        this.threeShipClick(pos);
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
