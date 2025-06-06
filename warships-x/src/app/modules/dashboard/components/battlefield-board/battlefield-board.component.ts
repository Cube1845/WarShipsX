import { Component, computed, input, output, signal } from '@angular/core';
import { Position } from '../../models/position';

@Component({
  selector: 'battlefield-board',
  imports: [],
  templateUrl: './battlefield-board.component.html',
  styleUrl: './battlefield-board.component.scss',
})
export class BattlefieldBoardComponent {
  sizePurposeArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  alphaChars = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

  onTileClick = output<Position>();

  hoverable = input<boolean>(false);

  highlightedPositions = input<Position[]>([]);
  secondlyHighlightedPositions = input<Position[]>([]);

  selectedPosition = input<Position>();

  highlightedPositionInclude(pos: Position) {
    return computed(() =>
      this.highlightedPositions().some(
        (x) => x.letter == pos.letter && x.number == pos.number
      )
    );
  }

  secondlyHighlightedPositionInclude(pos: Position) {
    return computed(() =>
      this.secondlyHighlightedPositions().some(
        (x) => x.letter == pos.letter && x.number == pos.number
      )
    );
  }

  isSelectedPosition(pos: Position) {
    return computed(
      () =>
        this.selectedPosition() != undefined &&
        this.selectedPosition()!.letter == pos.letter &&
        this.selectedPosition()!.number == pos.number
    );
  }

  tileClick(letter: string, number: number): void {
    this.onTileClick.emit({ letter: letter, number: number });
  }
}
