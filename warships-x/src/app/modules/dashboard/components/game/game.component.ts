import { Component } from '@angular/core';
import { BattlefieldBoardComponent } from '../battlefield-board/battlefield-board.component';

@Component({
  selector: 'app-game',
  imports: [BattlefieldBoardComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent {}
