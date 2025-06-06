import { Component, inject } from '@angular/core';
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

  fieldClicked(position: Position): void {
    this.dialogService.displayDialog(
      ShootDialogComponent,
      'Choose field',
      position
    );
  }
}
