import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'battlefield-board',
  imports: [],
  templateUrl: './battlefield-board.component.html',
  styleUrl: './battlefield-board.component.scss',
})
export class BattlefieldBoardComponent {
  sizePurposeArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  alphaChars = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

  hoverable = input<boolean>(false);
  smaller = input<boolean>(false);

  onTileClick = output<string>();

  selectedTile = input<string>('');
  selectedTileSignal = signal<string>(this.selectedTile());

  tileClick(letter: string, number: number): void {
    const field = letter + number.toString();

    if (this.selectedTileSignal() == field) {
      this.selectedTileSignal.set('');
      this.onTileClick.emit('');

      return;
    }

    this.selectedTileSignal.set(field);
    this.onTileClick.emit(field);
  }
}
