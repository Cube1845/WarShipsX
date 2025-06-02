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

  flattenAllShipPositions(): Position[] {
    const fields: Position[] = [];

    this.fourShip.forEach((x) => fields.push(x));
    this.threeShips.forEach((x) => x.forEach((n) => fields.push(n)));
    this.twoShips.forEach((x) => x.forEach((n) => fields.push(n)));
    this.oneShips.forEach((x) => x.forEach((n) => fields.push(n)));

    return fields;
  }

  setForbiddenFields(notIncludedPositions: Position[]): void {
    const flattenedFilteredShipPositions =
      this.flattenAllShipPositions().filter(
        (x) => !notIncludedPositions.includes(x)
      );

    const fieldNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    fieldNumbers.forEach((n) =>
      this.letters.forEach((a) => {
        const hasShipNearby = flattenedFilteredShipPositions.some(
          (x) =>
            (n - 1 == x.number && a == x.letter) ||
            (this.letters.indexOf(a) < 9 &&
              n - 1 == x.number &&
              a == this.letters[this.letters.indexOf(a) + 1]) ||
            (this.letters.indexOf(a) < 9 &&
              n == x.number &&
              a == this.letters[this.letters.indexOf(a) + 1]) ||
            (this.letters.indexOf(a) < 9 &&
              n + 1 == x.number &&
              a == this.letters[this.letters.indexOf(a) + 1]) ||
            (n + 1 == x.number && a == x.letter) ||
            (this.letters.indexOf(a) > 0 &&
              n + 1 == x.number &&
              a == this.letters[this.letters.indexOf(a) - 1]) ||
            (this.letters.indexOf(a) > 0 &&
              n == x.number &&
              a == this.letters[this.letters.indexOf(a) - 1]) ||
            (this.letters.indexOf(a) > 0 &&
              n - 1 == x.number &&
              a == this.letters[this.letters.indexOf(a) - 1]) ||
            (n == x.number && a == x.letter)
        );

        if (hasShipNearby) {
          this.forbiddenFields.push({ letter: a, number: n });
        }
      })
    );
  }

  modifyShips(pos: Position, ships: Position[][], shipSize: 3 | 2 | 1): void {
    var editedShipIndex: number | undefined;

    ships.forEach((x, i) => {
      if (x.includes(pos)) {
        editedShipIndex = i;
      }
    });

    if (!editedShipIndex) {
      var firstEmptyShipIndex: number | undefined;
      var indexFound = false;

      ships.forEach((x, i) => {
        if (x && x.length == 0 && !indexFound) {
          indexFound = true;
          firstEmptyShipIndex = i;
        }
      });

      if (firstEmptyShipIndex !== undefined) {
        this.modifyShipPosition(pos, ships[firstEmptyShipIndex], shipSize);
      }

      return;
    }

    this.modifyShipPosition(pos, ships[editedShipIndex], shipSize);
  }

  modifyShipPosition(
    pos: Position,
    ship: Position[],
    shipSize: 4 | 3 | 2 | 1
  ): void {
    if (ship.some((x) => x.letter == pos.letter && x.number == pos.number)) {
      this.removeShipField(pos, ship);
      this.setForbiddenFields(ship);
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

    if (this.forbiddenFields.includes(pos)) {
      return;
    }

    ship.push(pos);
    this.setForbiddenFields(ship);
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
