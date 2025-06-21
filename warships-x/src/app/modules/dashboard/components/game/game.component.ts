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
import { WsButtonComponent } from '../../../common/components/ws-button/ws-button.component';

@Component({
  selector: 'app-game',
  imports: [BattlefieldBoardComponent, WsButtonComponent],
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

  waitingForOpponent = false;

  constructor() {
    this.gameService.connectionClosed$.subscribe(() => {
      // this.router.navigateByUrl('home');
    });

    this.gameService.playerDataSent$.subscribe((data) =>
      this.setPlayerDataSignals(data)
    );

    this.gameService.waitForOpponent$.subscribe(() => {
      this.waitingForOpponent = true;

      setTimeout(() => {
        if (this.waitingForOpponent) {
          this.openWaitingForOpponentDialog();
        }
      }, 2000);
    });

    this.gameService.opponentConnected$.subscribe(() => {
      this.waitingForOpponent = false;
      this.dialogService.closeDialog();
    });

    this.gameService.opponentAbandoned$.subscribe(() => {
      this.router.navigateByUrl('home');
      this.toastService.success('Your opponent abandoned the game!');
      this.dialogService.closeDialog();
    });

    this.gameService.opponentShot$.subscribe((position) => {
      this.opponentShotPositions.update((currentPositions) => [
        ...currentPositions,
        position,
      ]);

      this.opponentHitPositions.set([
        ...this.getOpponentHitPositions(
          this.userShips(),
          this.opponentShotPositions()
        ),
      ]);

      this.userTurn.set(true);
    });

    this.gameService.shotFeedback$.subscribe((shot) => {
      switch (shot.shotState) {
        case ShotState.Missed:
          this.missedPositions.update((currentPositions) => [
            ...currentPositions,
            shot.position,
          ]);

          this.toastService.info('You missed', undefined, 2000);
          break;
        case ShotState.Hit:
          this.hitPositions.update((currentPositions) => [
            ...currentPositions,
            shot.position,
          ]);

          this.toastService.success('Hit!', undefined, 2000);
          break;
        case ShotState.Sunk:
          this.addPositionsToSunk(shot.position);

          this.toastService.success('You sank enemy ship!', undefined, 2000);
          break;
      }

      this.userTurn.set(false);
    });
  }

  private addPositionsToSunk(sunkPosition: Position): void {
    const sunkPositions: Position[] = [];
    const hitPositions = this.hitPositions();
    const alphaNumChars = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

    const stack: Position[] = [sunkPosition];

    while (stack.length > 0) {
      const current = stack.pop()!;

      if (
        sunkPositions.some(
          (p) => p.letter === current.letter && p.number === current.number
        )
      ) {
        continue;
      }

      sunkPositions.push(current);

      const neighbors = this.getAdjacentPositions(current, alphaNumChars);

      for (const neighbor of neighbors) {
        const isAlreadySunk = sunkPositions.some(
          (p) => p.letter === neighbor.letter && p.number === neighbor.number
        );

        const isHit = hitPositions.some(
          (p) => p.letter === neighbor.letter && p.number === neighbor.number
        );

        if (isHit && !isAlreadySunk) {
          stack.push(neighbor);
        }
      }
    }

    this.sunkPositions.update((current) => [...current, ...sunkPositions]);
  }

  private getAdjacentPositions(
    pos: Position,
    alphaNumChars: string[]
  ): Position[] {
    const positions: Position[] = [];
    const letterIndex = alphaNumChars.indexOf(pos.letter);

    if (letterIndex > 0) {
      positions.push({
        letter: alphaNumChars[letterIndex - 1],
        number: pos.number,
      });
    }
    if (letterIndex < alphaNumChars.length - 1) {
      positions.push({
        letter: alphaNumChars[letterIndex + 1],
        number: pos.number,
      });
    }
    if (pos.number > 1) {
      positions.push({ letter: pos.letter, number: pos.number - 1 });
    }
    if (pos.number < 10) {
      positions.push({ letter: pos.letter, number: pos.number + 1 });
    }

    return positions;
  }

  abandonGame(): void {
    this.dialogService
      .displayConfirmation(
        'Are you sure?',
        'Do you want to abandon the game?',
        {
          rejectLabel: 'Stay',
          acceptLabel: 'Leave',
        }
      )
      .subscribe(() => {
        this.gameService.abandonGame();
        this.router.navigateByUrl('home');
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
      { text: 'Waiting for opponent...' },
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
      data.ships.map((s) => s.positions).flat(),
      data.opponentShots
    );

    this.opponentHitPositions.set(opponentHitPositions);
    this.opponentShotPositions.set(data.opponentShots);
  }

  private getOpponentHitPositions(
    flattenedUserShips: Position[],
    opponentShots: Position[]
  ): Position[] {
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
        next: (position: any) => {
          this.currentSelectedTile.set(undefined);

          if (position) {
            this.gameService.shoot(position);
          }
        },
      });
  }
}
