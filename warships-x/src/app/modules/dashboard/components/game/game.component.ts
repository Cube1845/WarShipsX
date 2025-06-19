import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { BattlefieldBoardComponent } from '../battlefield-board/battlefield-board.component';
import { WsxDialogService } from '../../../common/services/wsx-dialog.service';
import { ShootDialogComponent } from '../shoot-dialog/shoot-dialog.component';
import { Position } from '../../models/position';
import { GameService } from '../../services/game.service';
import { Ship } from '../../models/ship';
import { PlayerData } from '../../models/player-data';
import { Router } from '@angular/router';
import { InfoPopupComponent } from '../../../common/components/info-popup/info-popup.component';
import { ToastService } from '../../../common/services/toast.service';
import { ShotState } from '../../models/shot-state';

@Component({
  selector: 'app-game',
  imports: [BattlefieldBoardComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent implements OnInit, OnDestroy {
  private readonly dialogService = inject(WsxDialogService);
  private readonly gameService = inject(GameService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  currentSelectedTile = signal<Position | undefined>(undefined);

  sunkPositions = signal<Position[]>([]);
  hitPositions = signal<Position[]>([]);
  missedPositions = signal<Position[]>([]);

  userShips = signal<Position[]>([]);

  opponentShotPositions = signal<Position[]>([]);
  opponentHitPositions = signal<Position[]>([]);

  userTurn = signal<boolean>(false);

  constructor() {
    this.gameService.connectionClosed$.subscribe(() => {
      // this.router.navigateByUrl('home');
    });

    this.gameService.playerDataSent$.subscribe((data) =>
      this.setPlayerDataSignals(data)
    );

    this.gameService.opponentDisconnected$.subscribe(() => {
      this.openWaitingForOpponentDialog();
    });

    this.gameService.opponentConnected$.subscribe(() => {
      this.dialogService.closeDialog();
    });

    this.gameService.opponentAbandoned$.subscribe(() => {
      this.router.navigateByUrl('home');
      this.toastService.error('Your opponent abandoned the game!');
      this.dialogService.closeDialog();
    });
  }

  openWaitingForConnectionDialog(): void {
    this.dialogService.displayDialog(
      InfoPopupComponent,
      '',
      { text: 'Waiting for connection...' },
      { closable: false, showHeader: false }
    );
  }

  openWaitingForOpponentDialog(): void {
    this.dialogService.displayDialog(
      InfoPopupComponent,
      '',
      { text: 'Opponent disconnected, waiting...' },
      { closable: false, showHeader: false }
    );
  }

  ngOnInit(): void {
    var connected = false;

    setTimeout(() => {
      if (!connected) {
        this.openWaitingForConnectionDialog();
      }
    }, 1000);

    this.gameService.connect().subscribe({
      next: () => {
        this.dialogService.closeDialog();
        connected = true;
      },
      error: () => {
        this.dialogService.closeDialog();
        this.router.navigateByUrl('home');
        this.toastService.error(
          'There was an error while trying to connect to the game'
        );
        connected = true;
      },
    });
  }

  ngOnDestroy(): void {
    this.gameService.disconnect();
  }

  private setPlayerDataSignals(data: PlayerData) {
    this.userTurn.set(data.playersTurn);

    const flattenedUserShips = data.ships.map((s) => s.positions).flat();
    this.userShips.set(flattenedUserShips);

    const missedPositions = data.executedShots
      .filter((s) => s.shotState == ShotState.Missed)
      .map((s) => s.position);
    this.missedPositions.set(missedPositions);

    const hitPositions = data.executedShots
      .filter((s) => s.shotState == ShotState.Hit)
      .map((s) => s.position);
    this.hitPositions.set(hitPositions);

    const sunkPositions = data.executedShots
      .filter((s) => s.shotState == ShotState.Sunk)
      .map((s) => s.position);
    this.sunkPositions.set(sunkPositions);

    const opponentHitPositions = this.getOpponentHitPositions(
      data.ships,
      data.opponentShots
    );

    this.opponentHitPositions.set(opponentHitPositions);
    this.opponentShotPositions.set(data.opponentShots);
  }

  private getOpponentHitPositions(
    playerShips: Ship[],
    opponentShots: Position[]
  ): Position[] {
    const flattenedUserShips = playerShips.map((s) => s.positions).flat();

    const hitPositions: Position[] = [];

    opponentShots.forEach((s) => {
      if (
        flattenedUserShips.some(
          (x) => s.letter == x.letter && s.number == x.number
        )
      ) {
        hitPositions.push(s);
      }
    });

    return hitPositions;
  }

  fieldClicked(position: Position): void {
    if (
      !this.userTurn() ||
      this.hitPositions().some(
        (x) => x.letter == position.letter && x.number == position.number
      ) ||
      this.missedPositions().some(
        (x) => x.letter == position.letter && x.number == position.number
      ) ||
      this.sunkPositions().some(
        (x) => x.letter == position.letter && x.number == position.number
      )
    ) {
      return;
    }

    this.currentSelectedTile.set(position);

    this.dialogService
      .displayDialog(ShootDialogComponent, 'Selected field', position, {
        position: 'top',
      })
      .subscribe({
        next: () => {
          this.currentSelectedTile.set(undefined);
        },
      });
  }
}
