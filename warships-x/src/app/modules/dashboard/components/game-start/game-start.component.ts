import {
  Component,
  computed,
  effect,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { WsButtonComponent } from '../../../common/components/ws-button/ws-button.component';
import { BattlefieldBoardComponent } from '../battlefield-board/battlefield-board.component';
import { SettingShipsService } from '../../services/setting-ships.service';
import { Position } from '../../models/position';
import { ToastService } from '../../../common/services/toast.service';
import { LobbyService } from '../../services/lobby.service';

@Component({
  selector: 'app-game-start',
  imports: [WsButtonComponent, BattlefieldBoardComponent],
  templateUrl: './game-start.component.html',
  styleUrl: './game-start.component.scss',
})
export class GameStartComponent implements OnInit, OnDestroy {
  private readonly settingShipsService = inject(SettingShipsService);
  private readonly toastService = inject(ToastService);
  private readonly lobbyService = inject(LobbyService);

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

  constructor() {
    this.lobbyService.playersCountChanged$.subscribe((playersCount) =>
      this.playersWaitingCount.set(playersCount)
    );
  }

  ngOnInit(): void {
    this.lobbyService.connect();
  }

  ngOnDestroy(): void {
    this.lobbyService.stopConnection();
  }

  clearShips(): void {
    if (this.userInQueue()) {
      return;
    }

    this.settingShipsService.clearShips();
  }

  shipEdit(shipSize: 4 | 3 | 2 | 1): void {
    if (this.userInQueue()) {
      return;
    }

    if (this.editState()) {
      const currentEditType = this.editType;
      this.cancelEdit();

      if (currentEditType == shipSize) {
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
    this.settingShipsService.clearIncorrectShips();

    this.editState.set(false);
    this.editType = undefined;
  }

  joinQueue(): void {
    if (!this.settingShipsService.areAllShipsSet()) {
      this.toastService.error('You have to set your ships first');
      return;
    }

    const ships: Position[][] = [
      this.settingShipsService.fourShip(),
      this.settingShipsService.threeShips()[0](),
      this.settingShipsService.threeShips()[1](),
      this.settingShipsService.twoShips()[0](),
      this.settingShipsService.twoShips()[1](),
      this.settingShipsService.twoShips()[2](),
      this.settingShipsService.oneShips()[0](),
      this.settingShipsService.oneShips()[1](),
      this.settingShipsService.oneShips()[2](),
      this.settingShipsService.oneShips()[3](),
    ];

    this.lobbyService
      .joinLobby(ships)
      .subscribe(() => this.userInQueue.set(true));
  }

  leaveQueue(): void {
    this.lobbyService.leaveLobby().subscribe(() => this.userInQueue.set(false));
  }
}
