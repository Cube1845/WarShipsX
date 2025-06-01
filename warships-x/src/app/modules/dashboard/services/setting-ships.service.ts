import { Injectable } from '@angular/core';
import { Position } from '../models/position';

@Injectable({
  providedIn: 'root',
})
export class SettingShipsService {
  private readonly letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

  readonly fourShip: Position[] = [];
  readonly threeShips: Position[][] = [[], []];
  readonly twoShips: Position[][] = [[], [], []];
  readonly oneShips: Position[][] = [[], [], [], []];

  readonly forbiddenFields: Position[] = [];

  setForbiddenFields(): void {}

  modifyShips(
    pos: Position,
    ships: Position[][],
    shipSize: 4 | 3 | 2 | 1
  ): void {}

  addShipPosition(
    pos: Position,
    ship: Position[],
    shipSize: 4 | 3 | 2 | 1
  ): void {
    if (ship.some((x) => x.letter == pos.letter && x.number == pos.number)) {
      this.removeShipField(pos, ship);
      return;
    }

    if (this.fourShip.length >= shipSize) {
      return;
    }

    const newPositions = this.cloneArray(ship);
    newPositions.push(pos);

    if (!this.isShipContinuous(newPositions)) {
      return;
    }

    ship.push(pos);

    if (ship.length >= shipSize) {
      this.setForbiddenFields();
    }
  }

  removeShipField(pos: Position, ship: Position[]): void {
    const clonedShip = ship.filter(
      (x) => !(x.letter == pos.letter && x.number == pos.number)
    );

    if (!this.isShipContinuous(clonedShip)) {
      return;
    }

    ship.forEach((x, i) => {
      if (x.letter == pos.letter && x.number == pos.number) {
        this.fourShip.splice(i, 1);
      }
    });
  }

  isShipContinuous(positions: Position[]): boolean {
    var isContinuous = true;

    if (positions.length <= 1) {
      return isContinuous;
    }

    positions.forEach((pos) => {
      const isLetterBehind = positions.some(
        (x) =>
          this.letters.indexOf(x.letter) ==
            this.letters.indexOf(pos.letter) - 1 && x.number == pos.number
      );
      const isLetterAhead = positions.some(
        (x) =>
          this.letters.indexOf(x.letter) ==
            this.letters.indexOf(pos.letter) + 1 && x.number == pos.number
      );

      const isNumberBehind = positions.some(
        (x) =>
          this.letters.indexOf(x.letter) == this.letters.indexOf(pos.letter) &&
          x.number == pos.number - 1
      );
      const isNumberAhead = positions.some(
        (x) =>
          this.letters.indexOf(x.letter) == this.letters.indexOf(pos.letter) &&
          x.number == pos.number + 1
      );

      if (
        !isLetterBehind &&
        !isLetterAhead &&
        !isNumberBehind &&
        !isNumberAhead
      ) {
        isContinuous = false;
      }
    });

    return isContinuous;
  }

  cloneArray(positions: Position[]): Position[] {
    var newArray: Position[] = [];

    positions.forEach((x) => {
      const newPos = {
        letter: x.letter,
        number: x.number,
      };

      newArray.push(newPos);
    });

    return newArray;
  }
}
