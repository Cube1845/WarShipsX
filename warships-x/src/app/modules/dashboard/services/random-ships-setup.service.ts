import { Injectable, WritableSignal } from '@angular/core';
import { Position } from '../models/position';

@Injectable({
  providedIn: 'root',
})
export class RandomShipsSetupService {
  private readonly letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

  randomlySetupShips(
    fourShip: WritableSignal<Position[]>,
    threeShips: WritableSignal<Position[]>[],
    twoShips: WritableSignal<Position[]>[],
    oneShips: WritableSignal<Position[]>[]
  ) {
    const occupied = new Set<string>();

    fourShip.set(this.placeShip(4, occupied));

    for (let i = 0; i < 2; i++) {
      threeShips[i].set(this.placeShip(3, occupied));
    }

    for (let i = 0; i < 3; i++) {
      twoShips[i].set(this.placeShip(2, occupied));
    }

    for (let i = 0; i < 4; i++) {
      oneShips[i].set(this.placeShip(1, occupied));
    }
  }

  private getKey(pos: Position): string {
    return `${pos.letter}${pos.number}`;
  }

  private isInside(letterIndex: number, number: number): boolean {
    return letterIndex >= 0 && letterIndex < 10 && number >= 1 && number <= 10;
  }

  private isFree(
    letterIndex: number,
    number: number,
    occupied: Set<string>
  ): boolean {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const li = letterIndex + dx;
        const n = number + dy;
        if (this.isInside(li, n)) {
          const key = `${this.letters[li]}${n}`;
          if (occupied.has(key)) return false;
        }
      }
    }
    return true;
  }

  private placeShip(length: number, occupied: Set<string>): Position[] {
    while (true) {
      const letterIndex = Math.floor(Math.random() * 10);
      const number = Math.floor(Math.random() * 10) + 1;

      if (!this.isFree(letterIndex, number, occupied)) {
        continue;
      }

      const ship: Position[] = [{ letter: this.letters[letterIndex], number }];
      const visited = new Set<string>([this.getKey(ship[0])]);

      while (ship.length < length) {
        const base = ship[Math.floor(Math.random() * ship.length)];
        const bi = this.letters.indexOf(base.letter);
        const bn = base.number;

        const neighbors: Position[] = [
          { letter: this.letters[bi + 1], number: bn },
          { letter: this.letters[bi - 1], number: bn },
          { letter: base.letter, number: bn + 1 },
          { letter: base.letter, number: bn - 1 },
        ].filter((p) => {
          const li = this.letters.indexOf(p.letter);
          return (
            this.isInside(li, p.number) &&
            !visited.has(this.getKey(p)) &&
            this.isFree(li, p.number, occupied)
          );
        });

        if (neighbors.length === 0) break;

        const next = neighbors[Math.floor(Math.random() * neighbors.length)];
        ship.push(next);
        visited.add(this.getKey(next));
      }

      if (ship.length === length) {
        ship.forEach((p) => occupied.add(this.getKey(p)));
        return ship;
      }
    }
  }
}
