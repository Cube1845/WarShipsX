import { Component, inject, signal } from '@angular/core';
import { BattlefieldBoardComponent } from '../battlefield-board/battlefield-board.component';
import { WsxDialogService } from '../../../common/services/wsx-dialog.service';
import { ShootDialogComponent } from '../shoot-dialog/shoot-dialog.component';
import { Position } from '../../models/position';
import { GameService } from '../../services/game.service';
import { ShotState } from '../../models/shot';

@Component({
  selector: 'app-game',
  imports: [BattlefieldBoardComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent {
  private readonly dialogService = inject(WsxDialogService);
  private readonly gameService = inject(GameService);

  currentSelectedTile = signal<Position | undefined>(undefined);

  sunkPositions = signal<Position[]>([]);
  hitPositions = signal<Position[]>([]);
  missedPositions = signal<Position[]>([]);

  userShips = signal<Position[]>([]);

  userTurn = signal<boolean>(false);

  constructor() {
    this.gameService.playerDataSent$.subscribe((data) => {
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
    });
  }

  fieldClicked(position: Position): void {
    if (
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
