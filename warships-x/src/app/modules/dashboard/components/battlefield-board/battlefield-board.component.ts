import { Component } from '@angular/core';

@Component({
  selector: 'battlefield-board',
  imports: [],
  templateUrl: './battlefield-board.component.html',
  styleUrl: './battlefield-board.component.scss',
})
export class BattlefieldBoardComponent {
  sizePurposeArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  alphaChars = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
}
