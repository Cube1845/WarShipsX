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
import { Router } from '@angular/router';
import { AuthDataService } from '../../../auth/services/auth-data.service';
import { RandomShipsSetupService } from '../../services/random-ships-setup.service';

@Component({
  selector: 'app-game-start',
  imports: [WsButtonComponent, BattlefieldBoardComponent],
  templateUrl: './game-start.component.html',
  styleUrl: './game-start.component.scss',
})
export class GameStartComponent implements OnInit, OnDestroy {
  private readonly settingShipsService = inject(SettingShipsService);
  private readonly randomShipsSetupService = inject(RandomShipsSetupService);
  private readonly lobbyService = inject(LobbyService);
  private readonly router = inject(Router);
  private readonly authDataService = inject(AuthDataService);

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
    this.settingShipsService.fourShip().length == 4 ? 1 : 0
  );

  threeShipsCount = computed(
    () =>
      this.settingShipsService.threeShips().filter((ship) => ship().length == 3)
        .length
  );

  twoShipsCount = computed(
    () =>
      this.settingShipsService.twoShips().filter((ship) => ship().length == 2)
        .length
  );

  oneShipsCount = computed(
    () =>
      this.settingShipsService.oneShips().filter((ship) => ship().length == 1)
        .length
  );

  areAllShipsSet = computed(() => {
    const fourShipSet = this.settingShipsService.fourShip().length == 4;
    const threeShipsSet =
      this.settingShipsService.threeShips().length == 2 &&
      this.settingShipsService.threeShips().every((x) => x().length == 3);
    const twoShipsSet =
      this.settingShipsService.twoShips().length == 3 &&
      this.settingShipsService.twoShips().every((x) => x().length == 2);
    const oneShipsSet =
      this.settingShipsService.oneShips().length == 4 &&
      this.settingShipsService.oneShips().every((x) => x().length == 1);

    return fourShipSet && threeShipsSet && twoShipsSet && oneShipsSet;
  });

  forbiddenFields = this.settingShipsService.forbiddenFields;

  constructor() {
    this.lobbyService.playersCountChanged$.subscribe((playersCount) =>
      this.playersWaitingCount.set(playersCount)
    );

    this.lobbyService.startGame$.subscribe(() =>
      this.lobbyService.disconnect().subscribe(() => {
        this.router.navigateByUrl('home/game');
      })
    );

    this.lobbyService.playerParticipates$.subscribe(() =>
      this.router.navigateByUrl('home/game')
    );
  }

  ngOnInit(): void {
    this.lobbyService.connect().subscribe({
      error: () => {
        this.authDataService.clearAuthData();
        this.router.navigateByUrl('');
      },
    });
  }

  ngOnDestroy(): void {
    this.lobbyService.disconnect();
  }

  setupShipsRandomly(): void {
    this.randomShipsSetupService.randomlySetupShips(
      this.settingShipsService.fourShip,
      this.settingShipsService.threeShips(),
      this.settingShipsService.twoShips(),
      this.settingShipsService.oneShips()
    );
  }

  logOut(): void {
    this.authDataService.clearAuthData();
    this.router.navigateByUrl('');
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
      .joinQueue(
        ships.map((s) => {
          return { positions: s };
        })
      )
      .subscribe(() => this.userInQueue.set(true));
  }

  leaveQueue(): void {
    this.lobbyService.leaveQueue().subscribe(() => this.userInQueue.set(false));
  }
}
