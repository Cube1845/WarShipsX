import { Component, inject, signal } from '@angular/core';
import { BattlefieldBoardComponent } from '../battlefield-board/battlefield-board.component';
import { WsxDialogService } from '../../../common/services/wsx-dialog.service';
import { ShootDialogComponent } from '../shoot-dialog/shoot-dialog.component';
import { Position } from '../../models/position';

@Component({
  selector: 'app-game',
  imports: [BattlefieldBoardComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent {
  private readonly dialogService = inject(WsxDialogService);

  currentSelectedTile = signal<Position | undefined>(undefined);

  shotPositions = signal<Position[]>([]);
  missedPositions = signal<Position[]>([]);

  userTurn = signal<boolean>(false);

  fieldClicked(position: Position): void {
    if (
      this.shotPositions().some(
        (x) => x.letter == position.letter && x.number == position.number
      ) ||
      this.missedPositions().some(
        (x) => x.letter == position.letter && x.number == position.number
      )
    ) {
      return;
    }

    this.currentSelectedTile.set(position);

    this.dialogService
      .displayDialog(ShootDialogComponent, 'Choose field', position, {
        position: 'top',
      })
      .subscribe({
        next: () => {
          this.currentSelectedTile.set(undefined);
        },
      });
  }
}
