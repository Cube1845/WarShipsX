import { Component, computed, effect, inject, signal } from '@angular/core';
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
    ...this.settingShipsService.fourShip(),
    ...this.settingShipsService.threeShips()[0](),
    ...this.settingShipsService.threeShips()[1](),
    ...this.settingShipsService.twoShips()[0](),
    ...this.settingShipsService.twoShips()[1](),
    ...this.settingShipsService.twoShips()[2](),
    ...this.settingShipsService.oneShips()[0](),
    ...this.settingShipsService.oneShips()[1](),
    ...this.settingShipsService.oneShips()[2](),
    ...this.settingShipsService.oneShips()[3](),
  ]);

  fourShipCount = computed(() =>
    this.settingShipsService.fourShip().length > 0 ? 1 : 0
  );

  threeShipsCount = computed(
    () =>
      this.settingShipsService.threeShips().filter((ship) => ship().length > 0)
        .length
  );

  twoShipsCount = computed(
    () =>
      this.settingShipsService.twoShips().filter((ship) => ship().length > 0)
        .length
  );

  oneShipsCount = computed(
    () =>
      this.settingShipsService.oneShips().filter((ship) => ship().length > 0)
        .length
  );

  shipEdit(shipSize: 4 | 3 | 2 | 1): void {
    if (this.editState()) {
      if (this.editType == shipSize) {
        this.cancelEdit();
        return;
      }
    }

    this.editState.set(true);
    this.editType = shipSize;
  }

  fieldClick(pos: Position): void {
    if (!this.editState()) {
      return;
    }

    switch (this.editType) {
      case 4:
        this.settingShipsService.modifyShipPosition(
          pos,
          this.settingShipsService.fourShip,
          this.editType
        );
        break;
      case 3:
        this.settingShipsService.modifyShips(
          pos,
          this.settingShipsService.threeShips,
          this.editType
        );
        break;
      case 2:
        this.settingShipsService.modifyShips(
          pos,
          this.settingShipsService.twoShips,
          this.editType
        );
        break;
      case 1:
        this.settingShipsService.modifyShips(
          pos,
          this.settingShipsService.oneShips,
          this.editType
        );
        break;
      default:
        break;
    }
  }

  cancelEdit(): void {
    switch (this.editType) {
      case 4:
        if (this.settingShipsService.fourShip().length != 4) {
          this.settingShipsService.modifySignalArray(
            this.settingShipsService.fourShip,
            (s) => (s.length = 0)
          );
        }
        break;
      case 3:
        this.settingShipsService.threeShips().forEach((x) => {
          if (x().length != 3) {
            this.settingShipsService.modifySignalArray(
              x,
              (s) => (s.length = 0)
            );
          }
        });
        break;
      case 2:
        this.settingShipsService.twoShips().forEach((x) => {
          if (x().length != 2) {
            this.settingShipsService.modifySignalArray(
              x,
              (s) => (s.length = 0)
            );
          }
        });
        break;
      case 1:
        this.settingShipsService.oneShips().forEach((x) => {
          if (x().length != 1) {
            this.settingShipsService.modifySignalArray(
              x,
              (s) => (s.length = 0)
            );
          }
        });
        break;
      default:
        break;
    }

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
