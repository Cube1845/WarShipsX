import { Component, computed, inject, signal } from '@angular/core';
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

  readonly maxFourShips: number = 1;
  readonly maxThreeShips: number = 2;
  readonly maxTwoShips: number = 3;
  readonly maxOneShips: number = 4;

  userInQueue = signal<boolean>(false);
  playersWaitingCount = signal<number>(0);

  editState = signal<boolean>(false);

  editType: 4 | 3 | 2 | 1 | undefined;

  allShips = computed(() => [
    ...this.settingShipsService.fourShip,
    ...this.settingShipsService.threeShips.flat(),
    ...this.settingShipsService.twoShips.flat(),
    ...this.settingShipsService.oneShips.flat(),
  ]);

  fourShipCount = computed(() =>
    this.settingShipsService.fourShip.length > 0 ? 1 : 0
  );

  threeShipsCount = computed(
    () =>
      this.settingShipsService.threeShips.filter((x) => x && x.length > 0)
        .length
  );

  twoShipsCount = computed(
    () =>
      this.settingShipsService.twoShips.filter((x) => x && x.length > 0).length
  );

  oneShipsCount = computed(
    () =>
      this.settingShipsService.oneShips.filter((x) => x && x.length > 0).length
  );

  shipEdit(shipSize: 4 | 3 | 2 | 1): void {
    if (this.editState() && this.editType == shipSize) {
      this.cancelEdit();
      return;
    }

    this.editState.set(true);
    this.editType = shipSize;
    this.settingShipsService.setForbiddenFields([]);
  }

  fourShipClick(pos: Position): void {
    this.settingShipsService.modifyShipPosition(
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
    switch (this.editType) {
      case 4:
        if (this.settingShipsService.fourShip.length != 4) {
          this.settingShipsService.fourShip.splice(0, 4);
        }
        break;
      case 3:
        break;
      default:
        break;
    }

    this.editState.set(false);
    this.editType = undefined;
    this.settingShipsService.forbiddenFields.splice(0, 100);
  }

  joinQueue(): void {
    this.userInQueue.set(true);
  }

  leaveQueue(): void {
    this.userInQueue.set(false);
  }
}
