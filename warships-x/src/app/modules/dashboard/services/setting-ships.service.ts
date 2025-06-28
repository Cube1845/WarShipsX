import { Injectable, signal, WritableSignal } from '@angular/core';
import { Position } from '../models/position';

@Injectable({
  providedIn: 'root',
})
export class SettingShipsService {
  private readonly letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

  readonly fourShip = signal<Position[]>([]);
  readonly threeShips = signal<WritableSignal<Position[]>[]>([
    signal<Position[]>([]),
    signal<Position[]>([]),
  ]);
  readonly twoShips = signal<WritableSignal<Position[]>[]>([
    signal<Position[]>([]),
    signal<Position[]>([]),
    signal<Position[]>([]),
  ]);
  readonly oneShips = signal<WritableSignal<Position[]>[]>([
    signal<Position[]>([]),
    signal<Position[]>([]),
    signal<Position[]>([]),
    signal<Position[]>([]),
  ]);

  readonly forbiddenFields = signal<Position[]>([]);

  clearShips(): void {
    this.fourShip.set([]);

    this.threeShips.set([signal<Position[]>([]), signal<Position[]>([])]);

    this.twoShips.set([
      signal<Position[]>([]),
      signal<Position[]>([]),
      signal<Position[]>([]),
    ]);

    this.oneShips.set([
      signal<Position[]>([]),
      signal<Position[]>([]),
      signal<Position[]>([]),
      signal<Position[]>([]),
    ]);

    this.forbiddenFields.set([]);
  }

  clearIncorrectShips(): void {
    if (this.fourShip().length != 4) {
      this.modifySignalArray(this.fourShip, (s) => (s.length = 0));
    }

    this.threeShips().forEach((x) => {
      if (x().length != 3) {
        this.modifySignalArray(x, (s) => (s.length = 0));
      }
    });

    this.twoShips().forEach((x) => {
      if (x().length != 2) {
        this.modifySignalArray(x, (s) => (s.length = 0));
      }
    });

    this.oneShips().forEach((x) => {
      if (x().length != 1) {
        this.modifySignalArray(x, (s) => (s.length = 0));
      }
    });

    this.setForbiddenFields([]);
  }

  flattenAllShipPositions(): Position[] {
    const fields: Position[] = [];

    this.fourShip().forEach((x) => fields.push(x));
    this.threeShips().forEach((x) => x().forEach((n) => fields.push(n)));
    this.twoShips().forEach((x) => x().forEach((n) => fields.push(n)));
    this.oneShips().forEach((x) => x().forEach((n) => fields.push(n)));

    return fields;
  }

  setForbiddenFields(notIncludedPositions: Position[]): void {
    const forbiddenFields: Position[] = [];

    const filteredShipPositions = this.flattenAllShipPositions().filter(
      (pos) =>
        !notIncludedPositions.some(
          (p) => p.letter === pos.letter && p.number === pos.number
        )
    );

    const fieldNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const maxLetterIndex = this.letters.length - 1;

    for (const number of fieldNumbers) {
      for (let letterIndex = 0; letterIndex <= maxLetterIndex; letterIndex++) {
        const letter = this.letters[letterIndex];

        const prevLetter =
          letterIndex > 0 ? this.letters[letterIndex - 1] : null;
        const nextLetter =
          letterIndex < maxLetterIndex ? this.letters[letterIndex + 1] : null;

        const hasShipNearby = filteredShipPositions.some((pos) => {
          const sameLetter = pos.letter === letter;
          const prevLetterMatch =
            prevLetter !== null && pos.letter === prevLetter;
          const nextLetterMatch =
            nextLetter !== null && pos.letter === nextLetter;
          const num = pos.number;

          return (
            (num === number && sameLetter) ||
            (num === number && (prevLetterMatch || nextLetterMatch)) ||
            ((num === number - 1 || num === number + 1) &&
              (sameLetter || prevLetterMatch || nextLetterMatch))
          );
        });

        if (hasShipNearby) {
          forbiddenFields.push({ letter, number });
        }
      }
    }

    const allShipPositions = this.flattenAllShipPositions();
    const finalForbiddenFields = forbiddenFields.filter(
      (pos) =>
        !allShipPositions.some(
          (shipPos) =>
            shipPos.letter === pos.letter && shipPos.number === pos.number
        )
    );

    this.forbiddenFields.set(finalForbiddenFields);
  }

  modifyShips(
    pos: Position,
    ships: WritableSignal<WritableSignal<Position[]>[]>,
    shipSize: 3 | 2 | 1
  ): void {
    var editedShipIndex: number | undefined;

    ships().forEach((x, i) => {
      if (
        (x().length > 0 && x().length < shipSize) ||
        x().some((s) => s.letter == pos.letter && s.number == pos.number)
      ) {
        editedShipIndex = i;
      }
    });

    if (editedShipIndex === undefined) {
      var firstEmptyShipIndex: number | undefined;
      var indexFound = false;

      ships().forEach((x, i) => {
        if (x() && x().length == 0 && !indexFound) {
          indexFound = true;
          firstEmptyShipIndex = i;
        }
      });

      if (firstEmptyShipIndex !== undefined) {
        this.modifyShipPosition(pos, ships()[firstEmptyShipIndex], shipSize);
      }

      return;
    }

    this.modifyShipPosition(pos, ships()[editedShipIndex], shipSize);
  }

  modifyShipPosition(
    pos: Position,
    ship: WritableSignal<Position[]>,
    shipSize: 4 | 3 | 2 | 1
  ): void {
    this.setForbiddenFields(ship());
    const forbiddenFields = this.forbiddenFields();
    const shipPositions = this.flattenAllShipPositions();

    if (ship().some((x) => x.letter == pos.letter && x.number == pos.number)) {
      this.removeShipField(pos, ship);
      return;
    }

    if (
      ship().length >= shipSize ||
      forbiddenFields.some(
        (f) => f.letter == pos.letter && f.number == pos.number
      ) ||
      shipPositions.some(
        (s) => s.letter == pos.letter && s.number == pos.number
      )
    ) {
      return;
    }

    const newPositions = this.cloneArray(ship());
    newPositions.push(pos);

    if (!this.isShipContinuous(newPositions)) {
      return;
    }

    this.modifySignalArray(ship, (s) => s.push(pos));

    if (ship().length == shipSize) {
      this.setForbiddenFields([]);
    }
  }

  removeShipField(pos: Position, ship: WritableSignal<Position[]>): void {
    const clonedShip = ship().filter(
      (x) => !(x.letter == pos.letter && x.number == pos.number)
    );

    if (!this.isShipContinuous(clonedShip)) {
      return;
    }

    ship().forEach((x, i) => {
      if (x.letter == pos.letter && x.number == pos.number) {
        this.modifySignalArray(ship, (s) => s.splice(i, 1));
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

  modifySignalArray(
    signalArray: WritableSignal<Position[]>,
    modifyFn: (array: Position[]) => void
  ): void {
    const array = [...signalArray()];

    modifyFn(array);

    signalArray.set(array);
  }
}
